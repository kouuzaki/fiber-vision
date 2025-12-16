import React from "react";

import { type ComponentPropsWithoutRef } from "react";

type AuthBaseProps = ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode;
};

export const AuthBase = ({ children, className, ...rest }: AuthBaseProps) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className={`w-full max-w-md ${className || ""}`} {...rest}>
        {children}
      </div>
    </main>
  );
};
