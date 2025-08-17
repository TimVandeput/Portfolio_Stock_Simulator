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
      className={`p-3 rounded-xl border-none bg-[#e0e5ec] shadow-inner focus:outline-none text-blue-400 placeholder-blue-300 ${className}`}
    />
  );
}
