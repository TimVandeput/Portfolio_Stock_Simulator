"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="sticky bottom-0 z-10 w-full flex items-center justify-center footer-shadow-above"
      style={{
        background: "var(--bg-surface)",
        minHeight: "2.5rem",
      }}
    >
      <div className="flex justify-center py-2">
        {" "}
        <span
          className="font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          &copy; Stock Simulator {year}
        </span>
      </div>
    </footer>
  );
}
