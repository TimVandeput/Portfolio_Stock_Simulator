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
      className={`${textColor} text-sm text-center h-5 mb-2 transition-all ${className}`}
    >
      {message ? message : <span className="opacity-0">placeholder</span>}
    </div>
  );
}
