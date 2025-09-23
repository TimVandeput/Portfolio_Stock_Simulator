import type { BaseComponentProps } from "@/types/components";

export interface StatusMessageProps extends BaseComponentProps {
  message: string;
  type?: "error" | "success";
}

export default function StatusMessage({
  message,
  type = "error",
  className = "",
}: StatusMessageProps) {
  return (
    <div
      key={`${message}-${type}`}
      className={`text-xs leading-tight text-center min-h-5 transition-opacity duration-200 ${
        type === "error" ? "text-error" : "text-success"
      } ${className}`}
    >
      {message ? message : <span className="opacity-0">placeholder</span>}
    </div>
  );
}
