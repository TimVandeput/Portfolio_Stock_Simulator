"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import type { WalletBalanceCardProps } from "@/types/components";

export default function WalletBalanceCard({
  walletBalance,
  walletLoading,
}: WalletBalanceCardProps) {
  return (
    <div className="neu-card p-4 rounded-xl mb-6">
      <div className="flex items-center gap-3">
        <DynamicIcon
          iconName="wallet"
          size={20}
          className="text-[var(--accent)]"
        />
        <div className="flex-1">
          <p className="text-sm text-[var(--text-secondary)]">Available Cash</p>
          {walletLoading ? (
            <div className="h-6 bg-[var(--surface)] rounded animate-pulse"></div>
          ) : (
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              ${walletBalance?.cashBalance.toFixed(2) ?? "0.00"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
