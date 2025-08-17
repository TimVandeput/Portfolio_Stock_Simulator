interface ErrorMessageProps {
  message: string;
  className?: string;
}

export default function ErrorMessage({
  message,
  className = "",
}: ErrorMessageProps) {
  return (
    <div
      className={`text-red-300 text-sm text-center h-5 mb-2 transition-all ${className}`}
    >
      {message ? message : <span className="opacity-0">placeholder</span>}
    </div>
  );
}
