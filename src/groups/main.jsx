import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { getT, applyTheme } from "../lib/trello.js";
import "./groups.css";

const t = getT();
applyTheme(t);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App t={t} />
  </React.StrictMode>
);
