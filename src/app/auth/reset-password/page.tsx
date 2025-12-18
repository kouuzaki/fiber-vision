import { AuthBase } from "@/components/features/auth-screens/auth-base";
import { AuthResetPassword } from "@/components/features/auth-screens/auth-reset-password";
import { BGPattern } from "@/components/ui/bg-pattern";
import { AudioLinesIcon } from "lucide-react";
import { Suspense } from "react";

function ResetPasswordContent() {
  return <AuthResetPassword />;
}

export default function ResetPasswordPage() {
  return (
    <div>
      <BGPattern variant="dots" mask="fade-bottom" size={50} />
      <AuthBase>
        <div className="flex items-center gap-4 justify-center pb-4">
          <AudioLinesIcon size={50} />
          <h1 className="text-2xl font-bold">Fiber Vision</h1>
        </div>
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        >
          <ResetPasswordContent />
        </Suspense>
      </AuthBase>
    </div>
  );
}
