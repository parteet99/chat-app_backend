import type { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "./auth.validation";
import { registerUser, loginUser, logoutUser } from "./auth.services";
import { ApiError } from "../../utils/ApiError";

const COOKIE_NAME = "token";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,  //7d
    path: "/"
}

export const register = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validation = registerSchema.safeParse(req.body);

        if (!validation.success) {
            throw new ApiError(
                400,
                "VALIDATION_ERROR",
                validation.error.issues[0].message
            );
        }

        const user = await registerUser(validation.data);

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: user
        })
    } catch (error) {
        next(error);
    }
}

export const login = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ApiError(
                400,
                "VALIDATION_ERROR",
                validation.error.issues[0].message
            )
        }

        const { user, token } = await loginUser(validation.data);

        res.cookie(COOKIE_NAME, token, cookieOptions);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}