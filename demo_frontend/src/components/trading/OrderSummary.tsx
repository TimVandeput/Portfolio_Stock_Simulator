"use client";

interface OrderSummaryProps {
  quantityNum: number;
  lastPrice: number;
  totalCost: number;
}

export default function OrderSummary({
  quantityNum,
  lastPrice,
  totalCost,
}: OrderSummaryProps) {
  return (
    <div className="bg-[var(--surface)] p-4 rounded-xl space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-[var(--text-secondary)]">Shares:</span>
        <span className="font-medium">{quantityNum.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-[var(--text-secondary)]">Price per share:</span>
        <span className="font-medium">${lastPrice.toFixed(2)}</span>
      </div>
      <div className="border-t border-[var(--border)] pt-2">
        <div className="flex justify-between">
          <span className="font-medium text-[var(--text-primary)]">
            Total Cost:
          </span>
          <span className="font-bold text-lg text-[var(--text-primary)]">
            ${totalCost.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
