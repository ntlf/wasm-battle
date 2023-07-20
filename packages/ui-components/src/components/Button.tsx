import { classNames } from "../classNames";
import React from "react";

interface ButtonProps extends React.ComponentPropsWithoutRef<"em"> {
  variant?: "primary" | "secondary" | "white";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  children: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button = ({
  variant = "primary",
  size = "md",
  children,
  disabled,
  ...rest
}: ButtonProps) => {
  const className = {
    base: "inline-flex items-center border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
    variants: {
      primary:
        "border-transparent shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600",
      secondary:
        "border-transparent text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:text-gray-700 disabled:bg-gray-100",
      white:
        "border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50 disabled:text-gray-200 disabled:bg-gray-100",
    },
    sizes: {
      xs: "px-2.5 py-1.5 text-xs font-medium rounded",
      sm: "px-3 py-2 text-sm font-medium leading-4 rounded",
      md: "px-4 py-2 text-sm font-medium rounded-md",
      lg: "px-4 py-2 text-base font-medium rounded-md",
      xl: "px-6 py-3 text-base font-medium rounded-md",
    },
  };

  return (
    <button
      type="button"
      className={classNames(
        className.base,
        className.variants[variant],
        className.sizes[size]
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
