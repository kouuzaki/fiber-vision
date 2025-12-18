import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables schema
   * These are only available on the server
   */
  server: {
    // Application Name
    APP_NAME: z.string().min(1),
    
    // Database
    DATABASE_HOST: z.string().min(1),
    DATABASE_PORT: z.coerce.number().default(5432),
    DATABASE_USER: z.string().min(1),
    DATABASE_PASSWORD: z.string().min(1),
    DATABASE_NAME: z.string().min(1),
    
    // Better Auth
    BETTER_AUTH_SECRET: z.string().min(32),
    
    // Google OAuth (optional)
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    
    // Node environment
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    
    // SMTP Configuration
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.coerce.number().default(587),
    SMTP_USER: z.string().min(1),
    SMTP_PASSWORD: z.string().min(1),
    SMTP_FROM_EMAIL: z.string().email(),
    SMTP_FROM_NAME: z.string().min(1),
  },

  /**
   * Client-side environment variables schema
   * These are exposed to the client (must be prefixed with NEXT_PUBLIC_)
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url(),
  },

  /**
   * Runtime environment variables
   * Manual destructuring of process.env is required for Next.js edge runtime
   */
  runtimeEnv: {
    // Application Name
    APP_NAME: process.env.APP_NAME,
    
    // Database
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    
    // Better Auth
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    
    // Client
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    
    // SMTP
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME,
  },

  /**
   * Skip validation in certain environments
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  
  /**
   * Makes it so that empty strings are treated as undefined
   */
  emptyStringAsUndefined: true,
});
