"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <AlertCircle size={64} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Something went wrong!
          </h1>
          <p className="text-[var(--text-secondary)] mb-4">
            An unexpected error occurred. This might be a temporary issue.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="text-left bg-[var(--surface)] p-4 rounded-lg mb-4">
              <summary className="cursor-pointer text-sm font-medium text-[var(--text-secondary)]">
                Error Details (Development)
              </summary>
              <pre className="text-xs mt-2 text-red-600 whitespace-pre-wrap break-words">
                {error.message}
              </pre>
            </details>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 neu-button px-6 py-3 rounded-xl font-medium transition-all duration-150 hover:scale-105"
          >
            <RefreshCw size={20} />
            Try Again
          </button>

          <div>
            <Link
              href="/home"
              className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Home size={16} />
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
