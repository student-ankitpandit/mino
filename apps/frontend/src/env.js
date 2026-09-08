// Runtime environment configuration for Mino
// Overridden dynamically by Bun dev server and build defines
window.__ENV__ = window.__ENV__ || {
  BACKEND_URL: "https://mino-be.onrender.com",
  WS_URL: "wss://mino-ws.onrender.com",
  NODE_ENV: "development",
};
