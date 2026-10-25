import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1)
        .max(50),
    email: z
        .string({error: "email required"})
        .trim()
        .email()
        .toLowerCase(),
    password: z
        .string()
        .min(6)
        .max(50)
})

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email()
        .toLowerCase(),
    password: z
        .string()
        .min(6)
        .max(50)
})

export interface JwtPayload {
    id: string,
    email: string,
}