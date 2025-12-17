import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/databases/db";
import { env } from "@/env";
import { username, emailOTP, twoFactor, lastLoginMethod, jwt } from "better-auth/plugins"


export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  appName: env.APP_NAME,
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
      enabled: !!env.GOOGLE_CLIENT_ID && !!env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    username(),
    emailOTP({
      async sendVerificationOTP(data) {
        console.log(data)
      }
    }),
    twoFactor({
      
    }),
    lastLoginMethod(),
    jwt(), 
  ]
});