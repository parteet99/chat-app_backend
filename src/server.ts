import "dotenv/config";

import { createServer } from "http";
import app from "./app";
import { connectDB, pool } from "./config/db";

const PORT = process.env.PORT || 5000;

const server = createServer(app);

const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    } catch (error) {
        console.error("Server startup failed: ", error);
        process.exit(1);
    }
}

startServer();


const shutdown = async () => {
    console.log("Shutting down server...");

    server.close(async () => {
        await pool.end();
        process.exit(0);
    })   
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);