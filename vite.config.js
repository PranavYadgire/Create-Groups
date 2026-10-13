import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Trello Power-Ups need a separate HTML entry point for the connector and for
// every popup/modal iframe. Vite's multi-page build compiles each one.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),      // groups manager (default local preview)
        status: resolve(__dirname, "status.html"), // optional service/status page
        powerup: resolve(__dirname, "powerup.html"), // Power-Up connector URL
        auth: resolve(__dirname, "auth.html"),       // authorization popup
        groups: resolve(__dirname, "groups.html"),   // Mention Groups manager popup
        mention: resolve(__dirname, "mention.html"), // card-level "Mention Group" popup
      },
    },
  },
  server: {
    port: 5173,
    cors: true,
  },
});
