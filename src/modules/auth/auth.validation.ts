import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email("Invalid email address"),

    password: z.string().min(8, "Password must contain at least 8 characters"),
    displayName: z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(100)
})

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),

    password: z.string().min(1, "Password is required")

});

export type RegisterSchema = z.infer<typeof registerSchema>
export type LoginSchema = z.infer<typeof loginSchema>