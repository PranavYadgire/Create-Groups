import React, { useEffect, useRef, useState } from "react";
import { APP_NAME, AUTH_MESSAGE_SOURCE, buildAuthorizeUrl, saveToken } from "../lib/auth.js";
import { CheckIcon, SpinnerIcon, AtIcon } from "../lib/icons.jsx";
import "./auth.css";

export default function AuthPopup({ t }) {
  const [status, setStatus] = useState("idle"); // idle | waiting | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const popupRef = useRef(null);

  // Receive the token posted by /authorized.html after the member approves.
  useEffect(() => {
    async function handleMessage(event) {
      // The token is a credential: only trust our own origin.
      if (event.origin !== window.location.origin) return;
      if (!event.data || event.data.source !== AUTH_MESSAGE_SOURCE) return;

      if (!event.data.token) {
        setStatus("error");
        setErrorMessage("No authorization token received from Trello.");
        return;
      }
      try {
        await saveToken(t, event.data.token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setErrorMessage("Failed to store authorization: " + (err.message || "Unknown error"));
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [t]);

  // Keep the popup height snug to its content.
  useEffect(() => {
    if (t && typeof t.sizeTo === "function") t.sizeTo("#root").catch(() => {});
  }, [t, status]);

  function handleAuthorize() {
    setStatus("waiting");
    setErrorMessage("");

    const authUrl = buildAuthorizeUrl(`${window.location.origin}/authorized.html`);
    const width = 580;
    const height = 750;
    const screenWidth = window.screen?.availWidth || 1280;
    const screenHeight = window.screen?.availHeight || 800;
    const left = Math.max(0, Math.round((screenWidth - width) / 2));
    const top = Math.max(0, Math.round((screenHeight - height) / 2));

    popupRef.current = window.open(
      authUrl,
      "trelloAuthPopup",
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
    );

    if (!popupRef.current || popupRef.current.closed || typeof popupRef.current.closed === "undefined") {
      setStatus("error");
      setErrorMessage("Your browser blocked the popup. Allow popups for this site and try again.");
    }
  }

  if (status === "success") {
    return (
      <div id="root-inner" className="auth-popup-container auth-state-box">
        <div className="auth-success-circle"><CheckIcon width={26} height={26} /></div>
        <h3 className="auth-title">Connected to {APP_NAME}</h3>
        <p className="auth-subtitle">Your Trello account is connected securely.</p>
        <button type="button" className="mg-btn mg-btn--primary mg-btn--block" onClick={() => t.closePopup && t.closePopup()}>
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="auth-popup-container">
      <div className="auth-header">
        <div className="auth-icon-badge"><AtIcon width={22} height={22} /></div>
        <div>
          <h3 className="auth-title">Connect {APP_NAME}</h3>
          <p className="auth-subtitle">Trello authorization</p>
        </div>
      </div>

      <p className="auth-body-text">
        Connect your Trello account so {APP_NAME} can post comments that mention a group, on your behalf.
      </p>

      <div className="auth-features-list">
        <div className="auth-feature-item"><span className="auth-feature-dot" /><span>Comments are posted under your name</span></div>
        <div className="auth-feature-item"><span className="auth-feature-dot" /><span>Your token is private to you</span></div>
        <div className="auth-feature-item"><span className="auth-feature-dot" /><span>Revoke access anytime in Trello settings</span></div>
      </div>

      {status === "error" && (
        <div className="mg-error">{errorMessage || "Couldn't connect. Check that popups are allowed and try again."}</div>
      )}

      <button type="button" onClick={handleAuthorize} disabled={status === "waiting"} className="mg-btn mg-btn--primary mg-btn--block">
        {status === "waiting" ? (<><SpinnerIcon /> Waiting for approval…</>) : "Connect Trello account"}
      </button>

      {status === "waiting" && (
        <p className="auth-body-text" style={{ textAlign: "center", fontSize: 12 }}>Finish authorizing in the popup window.</p>
      )}
      {status === "error" && (
        <button type="button" onClick={handleAuthorize} className="auth-link-btn">Try again</button>
      )}
    </div>
  );
}
