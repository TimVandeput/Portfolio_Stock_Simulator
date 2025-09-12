"use client";

export default function LiveClient() {
  return (
    <div className="live-container page-container w-full flex items-center justify-center font-sans px-6 py-6">
      <div className="live-card page-card p-8 rounded-2xl max-w-xl">
        <h1 className="live-title page-title text-3xl font-bold text-center mb-6">
          LIVE
        </h1>
        <p className="live-text page-text leading-relaxed mb-4 text-justify">
          Live market data will be displayed here.
        </p>
      </div>
    </div>
  );
}
