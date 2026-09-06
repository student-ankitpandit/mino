/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { App } from "./App";
import "./index.css";

// Ensure signature dark theme is active and cleanup any legacy theme storage
if (typeof document !== "undefined") {
  document.documentElement.classList.add("dark");
  document.documentElement.classList.remove("light");
  try {
    localStorage.removeItem("mino-theme");
  } catch {}
}

const elem = document.getElementById("root")!;
const app = (
  
    <App />
  
);

if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  // The hot module reloading API is not available in production.
  createRoot(elem).render(app);
}
