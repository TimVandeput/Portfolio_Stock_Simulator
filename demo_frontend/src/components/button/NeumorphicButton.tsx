interface NeumorphicButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  type?: "button" | "submit";
  className?: string;
  isFlipped?: boolean;
}

export default function NeumorphicButton({
  children,
  onClick,
  type = "button",
  className = "",
  isFlipped = false,
}: NeumorphicButtonProps) {
  const shadowClass = isFlipped
    ? "shadow-[6px_6px_10px_#c2c8d0,-5px_-5px_10px_#e6f0fa]"
    : "shadow-[-6px_6px_10px_#c2c8d0,5px_-5px_10px_#e6f0fa]";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`p-3 rounded-xl font-bold bg-[#e0e5ec] text-blue-300 transition hover:bg-blue-100 ${shadowClass} ${className}`}
    >
      {children}
    </button>
  );
}
