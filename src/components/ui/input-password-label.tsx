"use client";

import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import * as React from "react";
import { useId, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";

export interface InputPasswordLabelProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

export function InputPasswordLabel({
  value = "",
  onChange,
  onBlur,
  className,
  placeholder = "Password",
  ...props
}: InputPasswordLabelProps) {
  const id = useId();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(value);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  return (
    <div>
      {/* Password input field with toggle visibility button */}
      <div className="*:not-first:mt-2">
        <div className="relative">
          <Input
            aria-describedby={`${id}-description`}
            className={className ? `pe-9 ${className}` : "pe-9"}
            id={id}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            type={isVisible ? "text" : "password"}
            value={value}
            {...props}
          />
          <button
            aria-controls="password"
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={toggleVisibility}
            type="button"
          >
            {isVisible ? (
              <EyeOffIcon aria-hidden="true" size={16} />
            ) : (
              <EyeIcon aria-hidden="true" size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Password strength indicator */}
      <div
        aria-label="Password strength"
        aria-valuemax={4}
        aria-valuemin={0}
        aria-valuenow={strengthScore}
        className="mt-3 mb-4 h-1 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        tabIndex={-1}
      >
        <div
          className={`h-full ${getStrengthColor(
            strengthScore
          )} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 4) * 100}%` }}
        />
      </div>

      {/* Password strength description */}
      <p
        className="mb-2 font-medium text-foreground text-sm"
        id={`${id}-description`}
      >
        {getStrengthText(strengthScore)}. Must contain:
      </p>

      {/* Password requirements list */}
      <ul aria-label="Password requirements" className="space-y-1.5">
        {strength.map((req) => (
          <li className="flex items-center gap-2" key={req.text}>
            {req.met ? (
              <CheckIcon
                aria-hidden="true"
                className="text-emerald-500"
                size={16}
              />
            ) : (
              <XIcon
                aria-hidden="true"
                className="text-muted-foreground/80"
                size={16}
              />
            )}
            <span
              className={`text-xs ${
                req.met ? "text-emerald-600" : "text-muted-foreground"
              }`}
            >
              {req.text}
              <span className="sr-only">
                {req.met ? " - Requirement met" : " - Requirement not met"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
