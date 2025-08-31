interface HamburgerButtonProps {
  onClick: () => void;
}

export default function HamburgerButton({ onClick }: HamburgerButtonProps) {
  return (
    <button
      aria-label="Open menu"
      onClick={onClick}
      className="md:hidden p-3"
      style={{ color: "var(--text-primary)" }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M3 6h18M3 12h18M3 18h18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
