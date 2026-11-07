import { pool } from "../../config/db";
import type { AuthUser } from "./auth.types";

export interface DatabaseUser extends AuthUser {
    password_hash: string
}

export const findUserByEmail = async(
    email: String
): Promise<DatabaseUser | null> => {
    const query = `SELECT id, email, password_hash, display_name, avatar_key FROM users WHERE email = $1`;
    const param = [email]
    const result = await pool.query(query, param);
    return result.rows[0] ?? null;
}

export const createUser = async(
    email: string,
    passwordHash: string,
    displayName: string
): Promise<AuthUser> => {
    const query = `INSERT INTO users (email, password_hash, display_name)
        VALUES ($1, $2, $3)
        RETURNING id, email, display_name, avatar_key
    `
    const param = [email, passwordHash, displayName];
    const result = await pool.query(query, param);
    return result.rows[0];
}

export const createSession = async(
    userId: string,
    tokenHash: string,
    expiresAt: Date
) => {
    const query = `INSERT INTO sessions (user_id, token_hash, expires_at)
        VALUES ($1, $2, $3)
    `
    const param = [userId, tokenHash, expiresAt]
    await pool.query(query, param);
}

export const findActiveSession = async(
    tokenHash: string
) => {
    const query = `SELECT id, user_id FROM sessions WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW()`
    const param = [tokenHash]
    const result = await pool.query(query, param);
    return result.rows[0] ?? null;
}

export const revokeSession = async(
    tokenHash: string
) => {
    const query = `
        UPDATE sessions
        SET revoked_at = NOW()
        WHERE token_hash = $1
            AND revoked_at IS NULL
    `
    const param = [tokenHash]
    await pool.query(query, param);
}
