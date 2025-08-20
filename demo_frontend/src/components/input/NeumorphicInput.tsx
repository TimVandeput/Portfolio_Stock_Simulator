interface NeumorphicInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function NeumorphicInput({
  type,
  placeholder,
  value,
  onChange,
  className = "",
}: NeumorphicInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`neumorphic-input p-3 rounded-xl border-none focus:outline-none ${className}`}
      style={{
        boxShadow: "var(--shadow-neu-inset)",
        color: "var(--input-text)",
      }}
    />
  );
}
