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
import { authLoginSchema } from "@/schemas/auth/auth-login";
import { useForm } from "@tanstack/react-form";
import React from "react";

export function AuthLogin() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: authLoginSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);
      // Handle login logic here
    },
  });

  return (
    <section>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign In</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            id="login-form"
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

              <form.Field name="password">
                {(fieldApi) => {
                  const isInvalid =
                    fieldApi.state.meta.isTouched &&
                    fieldApi.state.meta.errors.length > 0;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input
                        id="password"
                        type="password"
                        value={fieldApi.state.value}
                        onBlur={fieldApi.handleBlur}
                        onChange={(e) => fieldApi.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter your password"
                      />
                      <FieldError errors={fieldApi.state.meta.errors} />
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <CardAction>
            <Button type="submit" form="login-form">
              Sign In
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </section>
  );
}
