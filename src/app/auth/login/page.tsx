import { AuthBase } from "@/components/features/auth-screens/auth-base";
import { AuthLogin } from "@/components/features/auth-screens/auth-login";
import { BGPattern } from "@/components/ui/bg-pattern";
import React from "react";

export default function LoginPage() {
  return (
    <div>
      <BGPattern variant="dots" mask="fade-bottom" size={50} />
      <AuthBase>
        <AuthLogin />
      </AuthBase>
    </div>
  );
}
