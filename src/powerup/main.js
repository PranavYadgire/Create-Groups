
/* global TrelloPowerUp */
import { isAuthorized } from "../lib/auth.js";

const origin = window.location.origin;

const ICON = {
  dark: `${origin}/icons/icon-white.svg`,
  light: `${origin}/icons/icon-dark.svg`,
};

function openGroupsManager(t) {
  return t.popup({
    title: "Mention Groups",
    url: t.signUrl("./groups.html"),
    height: 420,
  });
}

async function openMentionPicker(t) {
  if (!(await isAuthorized(t))) {
    return t.popup({
      title: "Authorize Mention Groups",
      url: t.signUrl("./auth.html"),
      height: 320,
    });
  }

  return t.popup({
    title: "Mention a group",
    url: t.signUrl("./mention.html"),
    height: 480,
  });
}

TrelloPowerUp.initialize({
  "authorization-status": async function (t) {
    return { authorized: await isAuthorized(t) };
  },

  "show-authorization": function (t) {
    return t.popup({
      title: "Authorize Mention Groups",
      url: t.signUrl("./auth.html"),
      height: 320,
    });
  },

  "show-settings": function (t) {
    return openGroupsManager(t);
  },

  "board-buttons": function () {
    return [
      {
        icon: ICON,
        text: "Mention Groups",
        callback: openGroupsManager,
      },
    ];
  },

  "card-buttons": function () {
    return [
      {
        icon: ICON.light,
        text: "Mention Group",
        condition: "always",
        callback: openMentionPicker,
      },
    ];
  },

  "card-back-section": function (t) {
    return {
      title: "Mention Groups",
      icon: ICON.light,
      content: {
        type: "iframe",
        url: t.signUrl("./mention.html"),
        height: 400,
      },
      action: {
        text: "Open Mention Groups",
        callback: openMentionPicker,
      },
    };
  },
});
