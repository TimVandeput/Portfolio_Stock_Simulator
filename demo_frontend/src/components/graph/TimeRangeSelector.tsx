"use client";

interface TimeRangeSelectorProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
  className?: string;
}

const timeRanges = [
  { value: "1mo", label: "1M" },
  { value: "1y", label: "1Y" },
  { value: "5y", label: "5Y" },
];

export default function TimeRangeSelector({
  selectedRange,
  onRangeChange,
  className = "",
}: TimeRangeSelectorProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {timeRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={`px-3 py-1 text-sm rounded-full border transition-colors chip ${
            selectedRange === range.value
              ? "chip-selected"
              : "hover:bg-[var(--surface)]"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
