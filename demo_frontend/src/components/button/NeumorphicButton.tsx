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
      className={`neu-button neumorphic-button p-3 rounded-xl font-bold 
        transition-all duration-150 
        active:translate-y-0.5
        active:duration-75
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}`}
    >
      {children}
    </button>
  );
}
