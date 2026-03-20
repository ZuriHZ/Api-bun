import { SQL } from "bun";

// Lee la variable de entorno o usa una base de prueba default
const dbUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/apibun_db";

export const sql = new SQL(dbUrl);

// Función ultra rápida para asegurar que la tabla del historial exista cada vez que inicie el servidor
export async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS chat_messages (
                id SERIAL PRIMARY KEY,
                role VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log("[DB] Tabla chat_messages verificada correctamente (PostgreSQL Nativo).");
    } catch (error: any) {
        console.error("[DB Error] No se pudo conectar a PostgreSQL.", error.message);
        console.warn("Asegúrate de tener corriendo tu servidor postgres y configurar DATABASE_URL en tu .env");
    }
}
