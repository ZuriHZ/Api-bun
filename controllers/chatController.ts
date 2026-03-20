import { OpenRouter } from "@openrouter/sdk";
import { AVAILABLE_MODELS } from "../config/models";

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
                JSON.stringify({
                    error: "Invalid JSON or empty body received",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                },
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

        // Array de IDs de modelos configurados centralmente en config/models.ts
        const freeModels = AVAILABLE_MODELS.map(m => m.id);

        let completion;
        let modelToUse = body.model;
        let attempts = 0;
        let finalError: any = null;

        // Si falla un modelo (p.ej. fue retirado y da 404), reintentamos hasta 3 veces con otro
        while (attempts < 3) {
            modelToUse =
                body.model ||
                freeModels[Math.floor(Math.random() * freeModels.length)];
            console.log(
                `[API] Intento ${attempts + 1}... Asignado: ${modelToUse}`,
            );

            try {
                completion = await openRouter.chat.send({
                    chatGenerationParams: {
                        model: modelToUse,
                        messages: [{ role: "user", content: userMessage }],
                        stream: true,
                    },
                });
                break; // Salió bien, rompemos el ciclo
            } catch (err: any) {
                console.error(
                    `[API] El modelo ${modelToUse} falló:`,
                    err?.message || err,
                );
                finalError = err;

                // Si el usuario especificó un modelo estricto, no iteramos over fallbacks
                if (body.model) break;
                attempts++;
            }
        }

        if (!completion) {
            throw (
                finalError ||
                new Error("Todos los intentos con modelos gratuitos fallaron.")
            );
        }

        // Creamos un stream legible (ReadableStream) nativo
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // completion es un EventStream, lo recorremos asíncronamente
                    for await (const chunk of completion as any) {
                        // Extraemos la parte de texto de cada "trocito"
                        const content =
                            chunk.choices?.[0]?.delta?.content || "";
                        if (content) {
                            // Codificamos y enviamos el trocito al cliente
                            controller.enqueue(
                                new TextEncoder().encode(content),
                            );
                        }
                    }
                    controller.close();
                } catch (error) {
                    console.error("Error en streaming:", error);
                    controller.error(error);
                }
            },
        });

        return new Response(stream, {
            status: 200,
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
                "Cache-Control": "no-cache",
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
