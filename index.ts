import { handleChat } from "./controllers/chatController";
import { getMessages, createMessage, deleteMessage } from "./controllers/messagesController";
import { getUsers, createUser, deleteUser, getConversations, createConversation, deleteConversation, getMessageById } from "./controllers/restController";
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

    if (url.pathname === "/rest" && req.method === "GET") {
      return new Response(Bun.file("./public/rest-test.html"));
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

    // USERS
    if (url.pathname === "/api/users" && req.method === "GET") return await getUsers(req);
    if (url.pathname === "/api/users" && req.method === "POST") return await createUser(req);
    if (url.pathname.startsWith("/api/users/") && req.method === "DELETE") {
       return await deleteUser(req, url.pathname.split("/").pop()!);
    }

    // CONVERSATIONS
    if (url.pathname === "/api/conversations" && req.method === "GET") return await getConversations(req);
    if (url.pathname === "/api/conversations" && req.method === "POST") return await createConversation(req);
    if (url.pathname.startsWith("/api/conversations/") && req.method === "DELETE") {
       return await deleteConversation(req, url.pathname.split("/").pop()!);
    }

    // MESSAGES
    if (url.pathname === "/api/messages" && req.method === "GET") {
      return await getMessages(req);
    }
    
    if (url.pathname === "/api/messages" && req.method === "POST") {
      return await createMessage(req);
    }

    // Identificar ID singular para borrar o pedir un solo mensaje
    if (url.pathname.startsWith("/api/messages/")) {
      const id = url.pathname.split("/").pop()!;
      if (req.method === "GET") return await getMessageById(req, id);
      if (req.method === "DELETE") return await deleteMessage(req, id);
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Listening on http://localhost:${server.port}...`);