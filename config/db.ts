import { SQL } from "bun";

// Lee la variable de entorno y por defecto la apuntamos a SQLite para pruebas ultra fáciles
const dbUrl = process.env.DATABASE_URL;

export const sql = new SQL(dbUrl!);

// Función ultra rápida para asegurar que la tabla exista
export async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log("[DB] ✅ Conectado exitosamente. Tablas generadas con Bun SQL nativo.");
    } catch (error: any) {
        console.error("[DB Error] Error inicializando tablas:", error.message);
    }
}
