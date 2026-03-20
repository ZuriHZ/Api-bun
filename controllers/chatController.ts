import { OpenRouter } from "@openrouter/sdk";
import { AVAILABLE_MODELS } from "../config/models";
import { sql } from "../config/db";

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

        // Guardamos el mensaje del usuario al instante en la base de datos local
        try {
            await sql`INSERT INTO chat_messages (role, content) VALUES ('user', ${userMessage})`;
        } catch (dbErr: any) {
            console.error(
                "[DB] Error al guardar mensaje de usuario:",
                dbErr.message,
            );
        }

        // Array de IDs de modelos configurados centralmente en config/models.ts
        const freeModels = AVAILABLE_MODELS.map((m) => m.id);

        let completion;
        let modelToUse = body.model;
        let attempts = 0;
        let finalError: any = null;

        // Si falla un modelo (p.ej. fue retirado y da 404), reintentamos hasta 3 veces con otro
        while (attempts < 10) {
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
                    let fullAiResponse = "";
                    // completion es un EventStream, lo recorremos asíncronamente
                    for await (const chunk of completion as any) {
                        // Extraemos la parte de texto de cada "trocito"
                        const content =
                            chunk.choices?.[0]?.delta?.content || "";
                        if (content) {
                            fullAiResponse += content;
                            // Codificamos y enviamos el trocito al cliente
                            controller.enqueue(
                                new TextEncoder().encode(content),
                            );
                        }
                    }

                    // Al terminar de streamear, guardamos la respuesta entera de la IA en DB
                    try {
                        if (fullAiResponse.trim()) {
                            await sql`INSERT INTO chat_messages (role, content) VALUES ('ai', ${fullAiResponse})`;
                        }
                    } catch (dbErr: any) {
                        console.error(
                            "[DB] Error al guardar respuesta de IA:",
                            dbErr.message,
                        );
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

        // En lugar de un error frío, devolvemos un chiste si los modelos fallan
        const jokes = [
            "Parece que la IA se tomó un descanso para tomar café... y no vuelve. ¿Por qué los programadores odian la naturaleza? Porque tiene demasiados bugs.",
            "¡Ups! Todas las IAs están en huelga. Dicen que quieren mejores procesadores. ¿Qué es un terapeuta? 1024 gigapeutas.",
            "La señal se perdió en el ciberespacio. Los modelos gratuitos están dormidos. ¿Qué le dice un GIF a un JPG? '¡Anímate hombre!'",
            "Houston, tenemos un problema. Las IAs no responden. ¿Cómo se despiden los programadores? '¡C-sharp!'",
            "Error 404: Cerebro artificial no encontrado. Intenta de nuevo. ¿Qué es un objeto? Una instancia de una clase que se porta mal.",
        ];
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

        return new Response(randomJoke, {
            status: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    }
};
