import { sql } from "../config/db";

// GET /api/messages - Obtener todo el historial
export const getMessages = async (req: Request) => {
    try {
        const messages = await sql`SELECT * FROM chat_messages ORDER BY created_at ASC`;
        return new Response(JSON.stringify(messages), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

// POST /api/messages - Guardar un nuevo mensaje en el historial
export const createMessage = async (req: Request) => {
    try {
        const body = (await req.json()) as { role?: string; content?: string };
        const { role, content } = body;

        if (!role || !content) {
            return new Response(JSON.stringify({ error: "Se requiere 'role' y 'content'" }), { status: 400 });
        }

        // Usamos template strings naticos de Bun SQL para inyectar seguro (evita SQL injection)
        const result = await sql`
            INSERT INTO chat_messages (role, content) 
            VALUES (${role}, ${content}) 
            RETURNING *
        `;

        return new Response(JSON.stringify(result[0]), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

// DELETE /api/messages/:id - Borrar un mensaje
export const deleteMessage = async (req: Request, id: string) => {
    try {
        await sql`DELETE FROM chat_messages WHERE id = ${id}`;
        return new Response(null, { status: 204 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
