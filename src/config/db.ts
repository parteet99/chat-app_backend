import { Pool } from "pg";

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL pool error:", error);
});

export const connectDB = async () => {
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("PostgreSQL connected: ", result.rows[0].now);
    } catch (error) {
        console.error("PostgreSQL connection failed:", error);
        throw error;
    }
};
