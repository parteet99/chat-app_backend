import { pool } from "../../config/db";
import type { UserProfile } from "./user.types";

export const findUserById = async(
    userId: string
): Promise<UserProfile | null> => {
    const query = `SELECT id, email, display_name, avatar_key, created_at 
        FROM users WHERE id = $1
    `
    const param = [userId]
    const result = await pool.query(query, param);

    return result.rows[0] ?? null;
}

export const updateUserProfile = async(
    userId: string,
    displayName: string
): Promise<UserProfile | null> => {
    const query = `UPDATE users 
        SET display_name = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, email, display_name, avatar_key, created_at
    `
    const param = [displayName, userId]
    const result = await pool.query(query, param);
    return result.rows[0] ?? null;
}

export const searchUsers = async (
    searchQuery: string,
    // currentUserId: string
) => {
    const query = `
        SELECT id, display_name, avatar_key
        FROM users
        WHERE
            display_name ILIKE $1
            OR email ILIKE $1
        ORDER BY display_name ASC
        LIMIT 20
    `
    const param = [`%${searchQuery}%`];
    const result = await pool.query(query, param);

    return result.rows;
};

