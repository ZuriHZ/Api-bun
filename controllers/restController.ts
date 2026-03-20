import { sql } from "../config/db";

// --- USERS ---
export const getUsers = async (req: Request) => {
    try {
        const users = await sql`SELECT * FROM users ORDER BY id DESC`;
        return new Response(JSON.stringify(users), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (e: any) { return new Response(JSON.stringify({ error: e.message }), { status: 500 }); }
};

export const createUser = async (req: Request) => {
    try {
        const randomName = "TestUser_" + Math.random().toString(36).substring(7);
        const randomEmail = randomName.toLowerCase() + "@test.com";

        const result = await sql`INSERT INTO users (username, email) VALUES (${randomName}, ${randomEmail}) RETURNING *`;
        return new Response(JSON.stringify(result[0]), { status: 201, headers: { "Content-Type": "application/json" } });
    } catch (e: any) { return new Response(JSON.stringify({ error: e.message }), { status: 500 }); }
};

export const deleteUser = async (req: Request, id: string) => {
    try {
        await sql`DELETE FROM users WHERE id = ${id}`;
        return new Response(null, { status: 204 });
    } catch (e: any) { return new Response(JSON.stringify({ error: e.message }), { status: 500 }); }
};

// --- CONVERSATIONS ---
export const getConversations = async (req: Request) => {
    try {
        const convos = await sql`SELECT * FROM conversations ORDER BY id DESC`;
        return new Response(JSON.stringify(convos), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (e: any) { return new Response(JSON.stringify({ error: e.message }), { status: 500 }); }
};

export const createConversation = async (req: Request) => {
    try {
        const title = "Nueva Conversación " + new Date().toLocaleTimeString();
        const result = await sql`INSERT INTO conversations (title) VALUES (${title}) RETURNING *`;
        return new Response(JSON.stringify(result[0]), { status: 201, headers: { "Content-Type": "application/json" } });
    } catch (e: any) { return new Response(JSON.stringify({ error: e.message }), { status: 500 }); }
};

export const deleteConversation = async (req: Request, id: string) => {
    try {
        await sql`DELETE FROM conversations WHERE id = ${id}`;
        return new Response(null, { status: 204 });
    } catch (e: any) { return new Response(JSON.stringify({ error: e.message }), { status: 500 }); }
};

// --- SINGLE MESSAGE GET ---
export const getMessageById = async (req: Request, id: string) => {
    try {
        const msg = await sql`SELECT * FROM chat_messages WHERE id = ${id}`;
        if (msg.length === 0) return new Response(JSON.stringify({ error: "Not Found" }), { status: 404 });
        return new Response(JSON.stringify(msg[0]), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (e: any) { return new Response(JSON.stringify({ error: e.message }), { status: 500 }); }
};
