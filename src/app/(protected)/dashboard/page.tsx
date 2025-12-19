import React from "react";
import { auth } from "@/server/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div>
      {session ? (
        <p>Hello {JSON.stringify(session)}</p>
      ) : (
        <p>You are not logged in</p>
      )}
    </div>
  );
}
