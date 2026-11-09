// global error middleware
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(error);

    if (error instanceof ApiError) {
        res.status(error.statusCode).json({
            success: false,
            code: error.code,
            message: error.message
        });
        return;
    }

    res.status(500).json({
        success: false,
        message: "Internal server error"
    })
}