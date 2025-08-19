interface NeumorphicButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}

export default function NeumorphicButton({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: NeumorphicButtonProps) {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`neumorphic-button p-3 rounded-xl font-bold 
        bg-[#e0e5ec] text-blue-400 
        transition-all duration-150 
        hover:bg-[#d9e6f9] 
        active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.25),inset_-2px_-2px_5px_rgba(255,255,255,0.7)]
        active:brightness-95
        active:translate-y-0.5
        active:duration-75
        shadow-[6px_6px_12px_rgba(0,0,0,0.25),-6px_-6px_12px_rgba(255,255,255,0.7)]
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d9e6f9]"}
        ${className}`}
    >
      {children}
    </button>
  );
}
