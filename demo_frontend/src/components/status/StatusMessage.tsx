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
  const textColor = type === "error" ? "text-red-300" : "text-green-400";

  return (
    <div
      key={`${message}-${type}`}
      className={`${textColor} text-sm text-center min-h-5 transition-opacity duration-200 ${className}`}
    >
      {message ? message : <span className="opacity-0">placeholder</span>}
    </div>
  );
}
