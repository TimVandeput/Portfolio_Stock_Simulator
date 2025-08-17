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
    ? "shadow-[inset_2px_2px_5px_rgba(0,0,0,0.25),inset_-2px_-2px_5px_rgba(255,255,255,0.7)]"
    : "shadow-[6px_6px_12px_rgba(0,0,0,0.25),-6px_-6px_12px_rgba(255,255,255,0.7)]";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`p-3 rounded-xl font-bold 
        bg-[#e0e5ec] text-blue-400 
        transition 
        hover:bg-[#d9e6f9] 
        active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.25),inset_-2px_-2px_5px_rgba(255,255,255,0.7)]
        ${shadowClass} ${className}`}
    >
      {children}
    </button>
  );
}
