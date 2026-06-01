import { type ReactNode } from "react";

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
  "aria-label"?: string;
  type?: "button" | "submit" | "reset";
}

export default function ButtonComponent({
  className,
  onClick,
  children,
  disabled,
  "aria-label": ariaLabel,
  type = "button",
}: ButtonProps) {
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      type={type}
    >
      {children}
    </button>
  );
}