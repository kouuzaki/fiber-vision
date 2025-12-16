import { AuthBase } from "@/components/features/auth-screens/auth-base";
import { AuthForgotPassword } from "@/components/features/auth-screens/auth-forgot-password";
import { BGPattern } from "@/components/ui/bg-pattern";
import { AudioLinesIcon } from "lucide-react";
import React from "react";

export default function ForgotPasswordPage() {
  return (
    <div>
      <BGPattern variant="dots" mask="fade-bottom" size={50} />
      <AuthBase>
        <div className="flex items-center gap-4 justify-center pb-4">
          <AudioLinesIcon size={50} />
          <h1 className="text-2xl font-bold">Fiber Vision</h1>
        </div>
        <AuthForgotPassword />
      </AuthBase>
    </div>
  );
}
