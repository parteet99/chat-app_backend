import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { corsMiddleware } from "./config/cors";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(helmet());
app.use(corsMiddleware);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Chat api is running"
    })
})

// authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// global error handler (always keep it at last)
app.use(errorMiddleware);

export default app;