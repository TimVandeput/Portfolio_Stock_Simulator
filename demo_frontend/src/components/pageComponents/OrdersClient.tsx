"use client";

export default function OrdersClient() {
  return (
    <div className="orders-container page-container w-full flex items-center justify-center font-sans px-6 py-6">
      <div className="orders-card page-card p-8 rounded-2xl max-w-xl">
        <h1 className="orders-title page-title text-3xl font-bold text-center mb-6">
          ORDERS
        </h1>
        <p className="orders-text page-text leading-relaxed mb-4 text-justify">
          Your trading orders and order history will be displayed here.
        </p>
      </div>
    </div>
  );
}
