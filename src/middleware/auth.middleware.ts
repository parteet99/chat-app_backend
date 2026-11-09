// This middleware will check two things
// Is the jwt valid and does this session still exists and remain active in PostgreSQL?

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findActiveSession } from "../modules/auth/auth.queries";

import { getJwtSecret, hashToken } from "../modules/auth/auth.services";
export interface AuthRequest extends Request{
    user?: {
        id: string
    }
}

export const requireAuth = async(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            })
            return;
        }

        const decoded = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload;
        if (!decoded.sub) {
            res.status(401).json({
                success: false,
                message: "Invalid token"
            })
            return;
        };

        const tokenHash = hashToken(token);
        const session = await findActiveSession(tokenHash);
        if (!session || session.user_id !== decoded.sub) {
            res.status(401).json({
                success: false,
                message: "Session expired or revoked"
            })
            return;
        };

        req.user = { id: session.user_id };

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Invalid or expired token"
        })   
    }
}