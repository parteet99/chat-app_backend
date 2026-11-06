import cors from "cors";

export const corsOptions = {
    origin: process.env.FRONTEND_URL,
    Credential: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}

export const corsMiddleware = cors(corsOptions);    