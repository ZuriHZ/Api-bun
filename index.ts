import { handleChat } from "./controllers/chatController";
import { AVAILABLE_MODELS } from "./config/models";

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    
    if (url.pathname === "/" && req.method === "GET") {
      return new Response(Bun.file("./public/index.html"));
    }
    
    if (url.pathname === "/health" && req.method === "GET") {
      return new Response(JSON.stringify({ status: "ok", message: "Health check passed" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (url.pathname === "/models" && req.method === "GET") {
      return new Response(JSON.stringify(AVAILABLE_MODELS), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (url.pathname === "/chat" && req.method === "POST") {
      return await handleChat(req);
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Listening on http://localhost:${server.port}...`);