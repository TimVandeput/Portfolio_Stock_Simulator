import type { BaseComponentProps } from "@/types/components";

export interface ButtonProps extends BaseComponentProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  "aria-label"?: string;
}

export default function NeumorphicButton({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  "aria-label": ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`neu-button neumorphic-button p-3 rounded-xl font-bold 
        transition-all duration-150 
        active:translate-y-0.5
        active:duration-75
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}`}
    >
      {children}
    </button>
  );
}
