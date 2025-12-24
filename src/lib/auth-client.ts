import { createAuthClient } from "better-auth/react";
import { usernameClient, adminClient } from "better-auth/client/plugins";
import { env } from "@/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [usernameClient(), adminClient()],
});

// Export commonly used methods for convenience
export const { signIn, signUp, signOut, useSession } = authClient;
