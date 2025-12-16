import * as z from "zod";

export const authForgotPasswordSchema = z.object({
    email: z.email("Please enter a valid email address"),
});
