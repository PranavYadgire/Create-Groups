
/* global TrelloPowerUp */

const ICON =
  "https://create-groups.vercel.app/icons/icon-dark.svg";

TrelloPowerUp.initialize({
  "card-buttons": function () {
    return [
      {
        icon: ICON,
        text: "TEST Mention Group",
        condition: "always",
        callback: function (t) {
          return t.popup({
            title: "Card Button Test",
            url: "https://create-groups.vercel.app/groups.html",
            height: 420,
          });
        },
      },
    ];
  },

  "board-buttons": function () {
    return [];
  },
});
