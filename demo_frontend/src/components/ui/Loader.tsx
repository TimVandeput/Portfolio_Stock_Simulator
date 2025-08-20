"use client";

export default function Loader() {
  return (
    <div
      className="fixed inset-0 z-[9999] grid place-items-center backdrop-blur-sm"
      style={{ backgroundColor: "var(--loader-overlay)" }}
    >
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
        style={{
          borderColor: "var(--loader-spinner)",
          borderTopColor: "transparent",
        }}
      />
    </div>
  );
}
