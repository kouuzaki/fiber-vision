import * as z from "zod";

export const authLoginSchema = z.object({
    identifier: z.string().min(1, "Please enter your email or username"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
    rememberMe: z.boolean(),
});