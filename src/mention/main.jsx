import React from "react";
import ReactDOM from "react-dom/client";
import MentionPopup from "./MentionPopup.jsx";
import { getT, applyTheme } from "../lib/trello.js";
import "./mention.css";

const t = getT();
applyTheme(t);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MentionPopup t={t} />
  </React.StrictMode>
);
