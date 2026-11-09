import jwt from "jsonwebtoken";
import crypto from "crypto";

import { findUserByEmail, createUser, createSession, revokeSession } from "./auth.queries"

import { hashPassword, comparePassword } from "../../utils/password";
import { ApiError } from "../../utils/ApiError";

import type { RegisterInput, LoginInput } from "./auth.types";

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    return secret;
};

// hash token helper
const hashToken = (token: string) => {
    return crypto.createHash("sha256").update(token).digest("hex");
}

// 7 day session for "createSession" query
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

export const registerUser = async (data: RegisterInput) => {
    const email = data.email.trim().toLowerCase();

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new ApiError(
            409,
            "EMAIL_EXISTS",
            "Email is already registered"
        );
    }

    const passwordHash = await hashPassword(data.password);

    const user = await createUser(
        email,
        passwordHash,
        data.displayName.trim()
    );

    return user;
}

export const loginUser = async (data: LoginInput) => {
    const email = data.email.trim().toLowerCase();

    const user = await findUserByEmail(email);

    if (!user) {
        throw new ApiError(
            401,
            "INVALID_CREDENTIALS",
            "Invalid email or password"
        )
    }

    const isPasswordValid = await comparePassword(
        data.password,
        user.password_hash
    );

    if (!isPasswordValid) {
        throw new ApiError(
            401,
            "INVALID_CREDENTIALS",
            "Invalid email or password"
        )
    }

    const token = jwt.sign(
        { sub: user.id },
        getJwtSecret(),
        { expiresIn: "7d" }
    );

    const tokenHash = hashToken(token)

    const expiresAt = new Date(Date.now() + SESSION_DURATION);

    await createSession(user.id, tokenHash, expiresAt);

    const { password_hash, ...safeUser } = user;

    return {
        user: safeUser,
        token
    };
}


export const logoutUser = async (token: string) => {
    const tokenHash = hashToken(token);

    await revokeSession(tokenHash);
};

export { hashToken, getJwtSecret, SESSION_DURATION };

