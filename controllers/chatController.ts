import { OpenRouter } from "@openrouter/sdk";

// Initialize the OpenRouter SDK
const openRouter = new OpenRouter({
    // Fallback to empty string if missing, though it requires api key
    apiKey: process.env.OPENROUTER_API_KEY || "",
    httpReferer: "http://localhost:3000", // Optional, adjust based on your site
    xTitle: "API-Bun-Chat", // Optional, name of your app
});

export const handleChat = async (req: Request): Promise<Response> => {
    try {
        // We expect the request body to contain the user "message" and optionally a "model".
        let body: { message?: string; model?: string };
        try {
            body = (await req.json()) as { message?: string; model?: string };
        } catch (e) {
            return new Response(
                JSON.stringify({ error: "Invalid JSON or empty body received" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
        const userMessage = body?.message;

        if (!userMessage) {
            return new Response(
                JSON.stringify({
                    error: 'The "message" field is required in the body',
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        // Default to a free model on OpenRouter, or allow overriding via the request
        const modelToUse = body.model || "google/gemma-3-4b-it:free";

        const completion = await openRouter.chat.send({
            chatGenerationParams: {
                model: modelToUse,
                messages: [{ role: "user", content: userMessage }],
                stream: true, // ✅ Activamos el modo streaming
            }
        });

        // Creamos un stream legible (ReadableStream) nativo
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // completion es un EventStream, lo recorremos asíncronamente
                    for await (const chunk of completion as any) {
                        // Extraemos la parte de texto de cada "trocito"
                        const content = chunk.choices?.[0]?.delta?.content || "";
                        if (content) {
                            // Codificamos y enviamos el trocito al cliente
                            controller.enqueue(new TextEncoder().encode(content));
                        }
                    }
                    controller.close();
                } catch (error) {
                    console.error("Error en streaming:", error);
                    controller.error(error);
                }
            }
        });

        return new Response(stream, {
            status: 200,
            headers: { 
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
                "Cache-Control": "no-cache"
            },
        });
    } catch (error: any) {
        console.error("Error during chat request:", error);
        return new Response(
            JSON.stringify({
                error: "Internal Server Error",
                details: error.message,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};
