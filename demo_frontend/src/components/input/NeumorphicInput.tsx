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
      className={`neumorphic-input p-3 rounded-xl border-none 
    bg-[#e4e8f0]  /* only slightly darker than #e0e5ec */
    shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2),inset_-1px_-1px_3px_rgba(255,255,255,0.6)]
    focus:outline-none 
    focus:bg-[#e0e4ec] /* subtle change on focus */
    text-blue-400 placeholder-blue-300 ${className}`}
    />
  );
}
