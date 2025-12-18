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
import { authLoginSchema } from "@/schemas/auth/auth-login";
import { signIn } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export function AuthLogin() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validators: {
      onSubmit: authLoginSchema,
    },
    onSubmit: async ({ value }) => {
      const loginPromise = new Promise((resolve, reject) => {
        signIn
          .email({
            email: value.email,
            password: value.password,
            rememberMe: value.rememberMe,
            callbackURL: "/dashboard",
          })
          .then((res) => {
            if (res.error) {
              reject(new Error(res.error.message || "Failed to log in"));
            } else {
              resolve(res.data);
            }
          })
          .catch(reject);
      });

      toast.promise(loginPromise, {
        loading: "Logging in...",
        success: "Logged in successfully",
        error: (err) => err?.message || "Failed to log in",
      });

      await loginPromise;
    },
  });

  return (
    <section>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            x Welcome back! Please enter your details.
          </CardDescription>
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
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <FieldLabel>
                          <Link
                            href="/auth/forgot-password"
                            className="hover:underline underline-offset-4"
                          >
                            Forgot password?
                          </Link>
                        </FieldLabel>
                      </div>
                      <Input
                        type="password"
                        id="password"
                        variant="password"
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
              <form.Field name="rememberMe">
                {(fieldApi) => {
                  return (
                    <Field orientation="horizontal">
                      <Checkbox
                        id="rememberMe"
                        defaultChecked
                        checked={fieldApi.state.value}
                        onBlur={fieldApi.handleBlur}
                        onCheckedChange={(checked) =>
                          fieldApi.handleChange(checked === true)
                        }
                      />
                      <FieldLabel htmlFor="rememberMe" className="font-normal">
                        Remember me
                      </FieldLabel>
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
                      form="login-form"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing In..." : "Sign In"}
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full flex items-center gap-2"
                      type="button"
                      disabled={isSubmitting}
                    >
                      <GoogleIcon size={20} />
                      <span>Login With Google</span>
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
              Don&apos;t have an account?
            </span>
            <Link href="/auth/signup" className="hover:underline">
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
