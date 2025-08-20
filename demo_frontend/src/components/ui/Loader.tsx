"use client";

type LoaderProps = {
  cover?: "page" | "content";
  className?: string;
};

export default function Loader({ cover = "page", className }: LoaderProps) {
  const overlayClasses = `grid place-items-center ${className ?? ""}`;
  const styleOverlay = { backgroundColor: "var(--bg-primary)" } as const;
  const styleSpinner = {
    borderColor: "var(--loader-spinner)",
    borderTopColor: "transparent",
  } as const;

  const content = (
    <div className="flex flex-col items-center gap-3">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4"
        style={styleSpinner}
      />
      <span
        className="font-semibold tracking-wide"
        style={{ color: "var(--text-primary)" }}
      >
        Loading...
      </span>
    </div>
  );

  if (cover === "content") {
    return (
      <div
        className={`absolute inset-0 z-[999] ${overlayClasses}`}
        style={styleOverlay}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] ${overlayClasses}`}
      style={styleOverlay}
    >
      {content}
    </div>
  );
}
