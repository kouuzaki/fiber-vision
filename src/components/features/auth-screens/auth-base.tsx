import React from "react";

type AuthBaseProps = {
  children: React.ReactNode;
};

export const AuthBase = ({ children }: AuthBaseProps) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
};
