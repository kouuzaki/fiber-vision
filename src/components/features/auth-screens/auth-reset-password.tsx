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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { InputPasswordLabel } from "@/components/ui/input-password-label";
import { Spinner } from "@/components/ui/spinner";
import { authResetPasswordSchema } from "@/schemas/auth/auth-reset-password";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { CheckCircle2Icon, KeyIcon, XCircleIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { AUTH_PAGES } from "@/lib/constants";

type PageStatus = "verifying" | "form" | "submitting" | "success" | "error";

export function AuthResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<PageStatus>(() =>
    token ? "verifying" : "error"
  );

  // Verify token on mount
  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const res = await fetch(
          `/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`
        );
        const data = await res.json();
        setStatus(data.valid ? "form" : "error");
      } catch {
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: authResetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error("No reset token provided");
        return;
      }

      setStatus("submitting");

      const resetPromise = new Promise((resolve, reject) => {
        authClient
          .resetPassword({
            newPassword: value.password,
            token,
          })
          .then((res) => {
            if (res.error) {
              reject(
                new Error(res.error.message || "Failed to reset password")
              );
            } else {
              resolve(res.data);
            }
          })
          .catch(reject);
      });

      toast.promise(resetPromise, {
        loading: "Resetting password...",
        success: "Password reset successfully!",
        error: (err) => {
          setStatus("form");
          return err?.message || "Failed to reset password";
        },
      });

      await resetPromise;
      setStatus("success");
    },
  });

  // Verifying token state
  if (status === "verifying") {
    return (
      <section>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>Verifying your reset link...</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Spinner className="size-8 text-primary" />
            <p className="mt-4 text-sm text-muted-foreground animate-pulse">
              Please wait...
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Error state (no token or invalid token)
  if (status === "error") {
    return (
      <section>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Invalid Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
              <XCircleIcon className="size-12 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <div className="flex flex-col gap-2 w-full">
              <Button asChild className="w-full">
                <Link href={AUTH_PAGES.FORGOT_PASSWORD}>Request New Link</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href={AUTH_PAGES.LOGIN}>Back to Login</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </section>
    );
  }

  // Success state
  if (status === "success") {
    return (
      <section>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Password Reset!</CardTitle>
            <CardDescription>
              Your password has been successfully changed.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
              <CheckCircle2Icon className="size-12 text-green-600 dark:text-green-400" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              You can now sign in with your new password.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <Button asChild className="w-full">
              <Link href={AUTH_PAGES.LOGIN}>Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    );
  }

  // Form state (form or submitting)
  return (
    <section>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3">
            <KeyIcon className="size-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "submitting" ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Spinner className="size-8 text-primary" />
              <p className="mt-4 text-sm text-muted-foreground animate-pulse">
                Resetting your password...
              </p>
            </div>
          ) : (
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                id="reset-password-form"
              >
                <FieldGroup>
                  <form.Field name="password">
                    {(fieldApi) => {
                      const isInvalid =
                        fieldApi.state.meta.isTouched &&
                        fieldApi.state.meta.errors.length > 0;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor="password">
                            New Password
                          </FieldLabel>
                          <InputPasswordLabel
                            value={fieldApi.state.value}
                            onBlur={fieldApi.handleBlur}
                            onChange={(e) =>
                              fieldApi.handleChange(e.target.value)
                            }
                            aria-invalid={isInvalid}
                            placeholder="Enter new password"
                          />
                          <FieldError errors={fieldApi.state.meta.errors} />
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field name="confirmPassword">
                    {(fieldApi) => {
                      const isInvalid =
                        fieldApi.state.meta.isTouched &&
                        fieldApi.state.meta.errors.length > 0;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor="confirmPassword">
                            Confirm Password
                          </FieldLabel>
                          <Input
                            variant="password"
                            value={fieldApi.state.value}
                            onBlur={fieldApi.handleBlur}
                            onChange={(e) =>
                              fieldApi.handleChange(e.target.value)
                            }
                            aria-invalid={isInvalid}
                            placeholder="Confirm new password"
                          />
                          <FieldError errors={fieldApi.state.meta.errors} />
                        </Field>
                      );
                    }}
                  </form.Field>
                </FieldGroup>
              </form>
              <div className="flex justify-center py-5">
                <form.Subscribe selector={(state) => state.isSubmitting}>
                  {(isSubmitting) => (
                    <Button
                      className="w-full"
                      type="submit"
                      form="reset-password-form"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Resetting..." : "Reset Password"}
                    </Button>
                  )}
                </form.Subscribe>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              Remember your password?
            </span>
            <Link href={AUTH_PAGES.LOGIN} className="hover:underline">
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
