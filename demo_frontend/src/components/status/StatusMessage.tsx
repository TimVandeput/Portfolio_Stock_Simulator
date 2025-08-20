interface StatusMessageProps {
  message: string;
  type?: "error" | "success";
  className?: string;
}

export default function StatusMessage({
  message,
  type = "error",
  className = "",
}: StatusMessageProps) {
  return (
    <div
      key={`${message}-${type}`}
      className={`text-sm text-center min-h-5 transition-opacity duration-200 ${className}`}
      style={{
        color: type === "error" ? "var(--logout-icon)" : "var(--success-text)",
      }}
    >
      {message ? message : <span className="opacity-0">placeholder</span>}
    </div>
  );
}
