"use client";

import Link from "next/link";
import DynamicIcon from "@/components/ui/DynamicIcon";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-[var(--accent)] mb-4">404</h1>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Page Not Found
          </h2>
          <p className="text-[var(--text-secondary)]">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 neu-button px-6 py-3 rounded-xl font-medium transition-all duration-150 hover:scale-105"
          >
            <DynamicIcon iconName="home" size={20} />
            Go to Home
          </Link>

          <div>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <DynamicIcon iconName="arrow-left" size={16} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
