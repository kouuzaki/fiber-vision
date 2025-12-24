import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/databases/db";
import { env } from "@/env";
import { username, emailOTP, twoFactor, lastLoginMethod, jwt, admin } from "better-auth/plugins";
import { sendEmail } from "@/lib/email-sender";
import VerificationEmail from "@/emails/verification-email";
import ForgotPasswordEmail from "@/emails/forgot-password-email";
import { ac, roles } from "@/lib/permissions";
import { user as userTable } from "@/databases/schemas/auth-schema";
import { count, eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  appName: env.APP_NAME,
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset Your Password - Fiber Vision",
        react: ForgotPasswordEmail({
          username: user.name || user.email.split("@")[0],
          resetUrl: url,
        }),
      });
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
      enabled: !!env.GOOGLE_CLIENT_ID && !!env.GOOGLE_CLIENT_SECRET,
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify Your Email - Fiber Vision",
        react: VerificationEmail({
          username: user.name || user.email.split("@")[0],
          verificationUrl: url,
        }),
      });
    },
    sendOnSignUp: true,
  },
  // session: {
  //   cookieCache:{
  //     enabled:true,
  //     maxAge:60*60*24*7, // 7 days
  //   }
  // },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Auto-assign admin role to the first user
          try {
            const result = await db.select({ count: count() }).from(userTable);
            const userCount = result[0]?.count ?? 0;

            // If this is the first user (count is 1), assign admin role
            if (userCount === 1) {
              await db
                .update(userTable)
                .set({ role: "admin" })
                .where(eq(userTable.id, user.id));
              console.log(`First user ${user.email} assigned admin role`);
            }
          } catch (error) {
            console.error("Failed to check/assign admin role:", error);
          }
        },
      },
    },
  },
  plugins: [
    username(),
    emailOTP({
      async sendVerificationOTP(data) {
        console.log(data);
      },
    }),
    twoFactor({}),
    lastLoginMethod(),
    jwt(),
    admin({
      ac,
      roles,
      defaultRole: "user",
    }),
  ],
});