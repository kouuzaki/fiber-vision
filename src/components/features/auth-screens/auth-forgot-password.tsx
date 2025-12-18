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
import { auth } from "@/server/auth";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import React from "react";

export function AuthForgotPassword() {
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: authForgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await auth.api.forgetPasswordEmailOTP({
        body: {
          email: value.email,
        },
      });
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
              <Button
                className="w-full"
                type="submit"
                form="forgot-password-form"
              >
                Send Reset Link
              </Button>
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
