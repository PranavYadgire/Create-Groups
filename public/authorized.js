(function () {
  // Trello OAuth redirects here with the token in the URL hash:
  // https://<domain>/authorized.html#token=ATTA...
  var hash = window.location.hash.substring(1);
  var params = new URLSearchParams(hash);
  var token = params.get("token");

  var titleEl = document.getElementById("status-title");
  var descEl = document.getElementById("status-desc");
  var spinnerEl = document.getElementById("spinner");

  if (!token) {
    if (spinnerEl) spinnerEl.style.display = "none";
    if (titleEl) titleEl.textContent = "Authorization failed";
    if (descEl) {
      descEl.textContent = "No token was received from Trello. You can close this window and try again.";
      descEl.style.color = "#c9372c";
    }
    return;
  }

  // Remove the token from the address bar/history so it isn't exposed.
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, "", window.location.pathname);
  }

  // Hand the token to the auth popup that opened this window.
  if (window.opener) {
    window.opener.postMessage(
      { source: "mention-groups-auth", token: token },
      window.location.origin
    );
  }

  if (titleEl) titleEl.textContent = "Connected!";
  if (descEl) descEl.textContent = "Mention Groups is authorized. Closing this window…";
  window.close();
  setTimeout(function () {
    if (descEl) descEl.textContent = "You can safely close this window now.";
  }, 500);
})();
