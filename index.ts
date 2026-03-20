import { handleChat } from "./controllers/chatController";
import { getMessages, createMessage, deleteMessage } from "./controllers/messagesController";
import { AVAILABLE_MODELS } from "./config/models";
import { initDB } from "./config/db";

// Inicializamos la base de datos al arrancar
await initDB();

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

    // --- REST API para PostgreSQL ---
    if (url.pathname === "/api/messages" && req.method === "GET") {
      return await getMessages(req);
    }
    
    if (url.pathname === "/api/messages" && req.method === "POST") {
      return await createMessage(req);
    }
    
    if (url.pathname.startsWith("/api/messages/") && req.method === "DELETE") {
      const id = url.pathname.split("/").pop();
      if (id) {
        return await deleteMessage(req, id);
      }
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Listening on http://localhost:${server.port}...`);