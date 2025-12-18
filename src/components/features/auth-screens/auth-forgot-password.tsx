"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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
import { Input } from "@/components/ui/input";
import { authForgotPasswordSchema } from "@/schemas/auth/auth-forgot-password";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { toast } from "sonner";

export function AuthForgotPassword() {
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: authForgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      const forgotPromise = new Promise<unknown>((resolve, reject) => {
        authClient
          .requestPasswordReset({
            email: value.email,
            redirectTo: "/auth/reset-password",
          })
          .then((res) => {
            if (res.error) {
              reject(
                new Error(res.error.message || "Failed to send reset email")
              );
            } else {
              resolve(res.data);
            }
          })
          .catch(reject);
      });

      toast.promise(forgotPromise, {
        loading: "Sending reset link...",
        success: "Reset link sent! Check your email.",
        error: (err) => err?.message || "Failed to send reset email",
      });

      await forgotPromise;
      form.reset();
    },
  });

  return (
    <section>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            id="forgot-password-form"
          >
            <FieldGroup>
              <form.Field name="email">
                {(fieldApi) => {
                  const isInvalid =
                    fieldApi.state.meta.isTouched &&
                    fieldApi.state.meta.errors.length > 0;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        id="email"
                        value={fieldApi.state.value}
                        onBlur={fieldApi.handleBlur}
                        onChange={(e) => fieldApi.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter your email"
                      />
                      <FieldError errors={fieldApi.state.meta.errors} />
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </form>
          <div className="flex justify-center py-5">
            <CardAction className="w-full">
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    className="w-full"
                    type="submit"
                    form="forgot-password-form"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                  </Button>
                )}
              </form.Subscribe>
            </CardAction>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              Remember your password?
            </span>
            <Link href="/auth/login" className="hover:underline">
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
