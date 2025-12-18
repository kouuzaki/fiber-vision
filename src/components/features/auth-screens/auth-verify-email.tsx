"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type VerifyStatus = "loading" | "success" | "error";

export function AuthVerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const callbackURL = searchParams.get("callbackURL") || "/dashboard";

  // Derive initial state from token - avoids synchronous setState in useEffect
  const [status, setStatus] = useState<VerifyStatus>(() =>
    token ? "loading" : "error"
  );
  const [errorMessage, setErrorMessage] = useState<string>(() =>
    token ? "" : "No verification token provided"
  );

  useEffect(() => {
    // Only run verification if we have a token
    if (!token) {
      return;
    }

    const verifyEmail = async () => {
      try {
        const result = await authClient.verifyEmail({
          query: { token },
        });

        if (result.error) {
          setStatus("error");
          setErrorMessage(result.error.message || "Failed to verify email");
        } else {
          setStatus("success");
          // Redirect after 2 seconds
          setTimeout(() => {
            router.push(callbackURL);
          }, 2000);
        }
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
    };

    verifyEmail();
  }, [token, callbackURL, router]);

  return (
    <section>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we verify your email"}
            {status === "success" && "Your email has been verified!"}
            {status === "error" && "Verification failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Spinner className="size-12 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground animate-pulse">
                Verifying your email address...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
                <CheckCircle2Icon className="size-12 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-green-600 dark:text-green-400">
                  Email Verified Successfully!
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Redirecting you to dashboard...
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
                <XCircleIcon className="size-12 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-red-600 dark:text-red-400">
                  Verification Failed
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          {status === "loading" && (
            <p className="text-xs text-muted-foreground">
              Do not refresh or close this page
            </p>
          )}
          {status === "success" && (
            <Button asChild>
              <Link href={callbackURL}>Go to Dashboard</Link>
            </Button>
          )}
          {status === "error" && (
            <div className="flex flex-col gap-2 w-full">
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/auth/signup">Create New Account</Link>
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </section>
  );
}
