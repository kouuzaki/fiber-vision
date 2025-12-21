"use client";

import GoogleIcon from "@/components/assets/google-icon";
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
import { InputPasswordLabel } from "@/components/ui/input-password-label";
import { authSignupSchema } from "@/schemas/auth/auth-signup";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { toast } from "sonner";
import { AUTH_PAGES } from "@/lib/constants";

export function AuthSignup() {
  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: authSignupSchema,
    },
    onSubmit: async ({ value }) => {
      const signupPromise = new Promise((resolve, reject) => {
        authClient.signUp
          .email({
            email: value.email,
            password: value.password,
            name: value.name,
            username: value.username,
            callbackURL: AUTH_PAGES.LOGIN,
          })
          .then((res) => {
            if (res.error) {
              reject(
                new Error(res.error.message || "Failed to create account")
              );
            } else {
              resolve(res.data);
            }
          })
          .catch(reject);
      });

      toast.promise(signupPromise, {
        loading: "Creating account...",
        success:
          "Account created successfully, check your email for verification",
        error: (err) => err?.message || "Failed to create account",
      });

      await signupPromise;
      form.reset();
    },
  });

  return (
    <section>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Sign up to get started with your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            id="signup-form"
          >
            <FieldGroup>
              <form.Field name="name">
                {(fieldApi) => {
                  const isInvalid =
                    fieldApi.state.meta.isTouched &&
                    fieldApi.state.meta.errors.length > 0;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input
                        id="name"
                        value={fieldApi.state.value}
                        onBlur={fieldApi.handleBlur}
                        onChange={(e) => fieldApi.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter your full name"
                      />
                      <FieldError errors={fieldApi.state.meta.errors} />
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="username">
                {(fieldApi) => {
                  const isInvalid =
                    fieldApi.state.meta.isTouched &&
                    fieldApi.state.meta.errors.length > 0;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="username">Username</FieldLabel>
                      <Input
                        id="username"
                        value={fieldApi.state.value}
                        onBlur={fieldApi.handleBlur}
                        onChange={(e) => fieldApi.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Choose a username"
                      />
                      <FieldError errors={fieldApi.state.meta.errors} />
                    </Field>
                  );
                }}
              </form.Field>

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
                      <InputPasswordLabel
                        value={fieldApi.state.value}
                        onBlur={fieldApi.handleBlur}
                        onChange={(e) => fieldApi.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Create a password"
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
                        id="confirmPassword"
                        type="password"
                        variant="password"
                        value={fieldApi.state.value}
                        onBlur={fieldApi.handleBlur}
                        onChange={(e) => fieldApi.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Re-enter your password"
                      />
                      <FieldError errors={fieldApi.state.meta.errors} />
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </form>
          <div className="flex justify-center py-5">
            <CardAction className="w-full flex flex-col gap-2">
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <>
                    <Button
                      className="w-full"
                      type="submit"
                      form="signup-form"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating Account..." : "Create Account"}
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full flex items-center gap-2"
                      type="button"
                      disabled={isSubmitting}
                    >
                      <GoogleIcon size={20} />
                      <span>Sign Up With Google</span>
                    </Button>
                  </>
                )}
              </form.Subscribe>
            </CardAction>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              Already have an account?
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
