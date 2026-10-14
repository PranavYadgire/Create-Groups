
/* global TrelloPowerUp */
import { isAuthorized } from "../lib/auth.js";

const origin = window.location.origin;

const ICON = {
  dark: `${origin}/icons/icon-white.svg`,
  light: `${origin}/icons/icon-dark.svg`,
};

// Open the group management screen.
function openGroupsManager(t) {
  return t.popup({
    title: "Mention Groups",
    url: t.signUrl("./groups.html"),
    height: 420,
  });
}

// Open the group picker for the current Trello card.
async function openMentionPicker(t) {
  try {
    const authorized = await isAuthorized(t);

    if (!authorized) {
      return t.popup({
        title: "Authorize Mention Groups",
        url: t.signUrl("./auth.html"),
        height: 320,
      });
    }

    return t.popup({
      title: "Mention a Group",
      url: t.signUrl("./mention.html"),
      height: 480,
    });
  } catch (error) {
    console.error("Mention Groups could not open:", error);
    throw error;
  }
}

TrelloPowerUp.initialize({
  "authorization-status": async function (t) {
    return {
      authorized: await isAuthorized(t),
    };
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

  // Board button: create, edit and manage groups.
  "board-buttons": function () {
    return [
      {
        icon: ICON,
        text: "Mention Groups",
        callback: openGroupsManager,
      },
    ];
  },

  // Card button: choose a group and compose a comment.
  "card-buttons": function () {
    return [
      {
        icon: ICON,
        text: "Mention Group",
        callback: openMentionPicker,
      },
    ];
  },
});
