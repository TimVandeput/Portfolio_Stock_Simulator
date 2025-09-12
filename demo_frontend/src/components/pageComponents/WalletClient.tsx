"use client";

export default function WalletClient() {
  return (
    <div className="wallet-container page-container w-full flex items-center justify-center font-sans px-6 py-6">
      <div className="wallet-card page-card p-8 rounded-2xl max-w-xl">
        <h1 className="wallet-title page-title text-3xl font-bold text-center mb-6">
          WALLET
        </h1>
        <p className="wallet-text page-text leading-relaxed mb-4 text-justify">
          Your wallet balance and transaction history will be displayed here.
        </p>
      </div>
    </div>
  );
}
