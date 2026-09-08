import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    "/env.js": () => {
      const backendUrl =
        process.env.BACKEND_URL ||
        process.env.VITE_BACKEND_URL ||
        "https://mino-be.onrender.com";
      const wsUrl =
        process.env.WS_URL ||
        process.env.VITE_WS_URL ||
        "wss://mino-ws.onrender.com";
      const nodeEnv = process.env.NODE_ENV || "development";

      return new Response(
        `window.__ENV__ = ${JSON.stringify({
          BACKEND_URL: backendUrl,
          WS_URL: wsUrl,
          NODE_ENV: nodeEnv,
        })};`,
        {
          headers: {
            "Content-Type": "application/javascript; charset=utf-8",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }
      );
    },

    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);
