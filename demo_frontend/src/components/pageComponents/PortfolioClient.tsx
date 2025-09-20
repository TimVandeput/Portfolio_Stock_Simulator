"use client";

export default function PortfolioClient() {
  return (
    <div className="portfolio-container page-container w-full flex items-center justify-center font-sans px-6 py-6">
      <div className="portfolio-card page-card p-8 rounded-2xl max-w-xl">
        <h1 className="portfolio-title page-title text-3xl font-bold text-center mb-6">
          PORTFOLIO
        </h1>
        <p className="portfolio-text page-text leading-relaxed mb-4 text-justify">
          Your investment portfolio overview will be displayed here.
        </p>
      </div>
    </div>
  );
}
