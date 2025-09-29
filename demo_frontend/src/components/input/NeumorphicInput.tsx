import type { BaseComponentProps } from "@/types/components";

export interface InputProps extends BaseComponentProps {
  type: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export default function NeumorphicInput({
  type,
  placeholder,
  value,
  onChange,
  className = "",
  disabled = false,
  required = false,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={`neumorphic-input p-3 rounded-xl border-none focus:outline-none ${className}`}
    />
  );
}
