import { AuthBase } from "@/components/features/auth-screens/auth-base";
import { AuthVerifyEmail } from "@/components/features/auth-screens/auth-verify-email";
import { BGPattern } from "@/components/ui/bg-pattern";
import { AudioLinesIcon } from "lucide-react";
import { Suspense } from "react";

function VerifyEmailContent() {
  return <AuthVerifyEmail />;
}

export default function VerifyEmailPage() {
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
          <VerifyEmailContent />
        </Suspense>
      </AuthBase>
    </div>
  );
}
