import { z } from "zod";

export const updateProfileSchema = z.object({
    displayName: z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(100, "Name cannot exceed 100 characters")
}).strict(); //prevents users from sending unexpected fields. Only "displayName" is accepted

export const SearchUsersSchema = z.object({
    query: z
        .string()
        .trim()
        .min(2, "Search query must contain at least 2 characters")
        .max(50, "Search query cannot exceed 50 characters")
});