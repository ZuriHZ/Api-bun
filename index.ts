const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    
    if (url.pathname === "/health" && req.method === "GET") {
      return new Response(JSON.stringify({ status: "ok", message: "Health check passed" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Listening on http://localhost:${server.port}...`);