"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="sticky bottom-0 z-10 w-full h-18 flex items-center justify-center footer-shadow-above"
      style={{
        background: "var(--bg-surface)",
        minHeight: "4.5rem",
      }}
    >
      <div className="flex justify-center pt-4">
        <span
          className="font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          &copy; Tim Vandeput {year}
        </span>
      </div>
    </footer>
  );
}
