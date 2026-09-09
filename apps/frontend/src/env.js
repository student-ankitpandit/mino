// Runtime environment configuration for Mino
// Overridden dynamically by Bun dev server and build defines
window.__ENV__ = window.__ENV__ || {
  BACKEND_URL:
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
      ? "http://localhost:3001"
      : "https://mino-be.onrender.com",
  WS_URL: "wss://mino-ws.onrender.com",
  NODE_ENV: "development",
};
