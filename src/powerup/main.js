/* global TrelloPowerUp */
import { isAuthorized } from "../lib/auth.js";

const origin = window.location.origin;
const ICON = {
  dark: `${origin}/icons/icon-white.svg`,  // shown on dark backgrounds
  light: `${origin}/icons/icon-dark.svg`,  // shown on light backgrounds
};

// Opens the groups manager (the screens in the Figma: list, create, edit, detail).
function openGroupsManager(t) {
  return t.popup({
    title: "Mention Groups",
    url: "./groups.html",
    height: 420,
  });
}

// Opens the card-level picker that posts a comment mentioning a whole group.
async function openMentionPicker(t) {
  if (!(await isAuthorized(t))) {
    return t.popup({ title: "Authorize Mention Groups", url: "./auth.html", height: 320 });
  }
  return t.popup({
    title: "Mention a group",
    url: "./mention.html",
    height: 380,
  });
}

TrelloPowerUp.initialize({
  // Trello asks this to decide whether to prompt the member to authorize.
  "authorization-status": async function (t) {
    return { authorized: await isAuthorized(t) };
  },

  "show-authorization": function (t) {
    return t.popup({ title: "Authorize Mention Groups", url: "./auth.html", height: 320 });
  },

  // Power-Up settings from the board menu -> same groups manager.
  "show-settings": function (t) {
    return openGroupsManager(t);
  },

  // Board header button: manage groups.
  "board-buttons": function () {
    return [
      {
        icon: ICON,
        text: "Mention Groups",
        callback: openGroupsManager,
      },
    ];
  },

  // Card back button (sidebar -> Power-Ups): mention a group on this card.
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
