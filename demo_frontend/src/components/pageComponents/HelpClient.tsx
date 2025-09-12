"use client";

export default function HelpClient() {
  return (
    <div className="help-container page-container w-full flex items-center justify-center font-sans px-6 py-6">
      <div className="help-card page-card p-8 rounded-2xl max-w-xl">
        <h1 className="help-title page-title text-3xl font-bold text-center mb-6">
          HELP
        </h1>
        <p className="help-text page-text leading-relaxed mb-4 text-justify">
          Help documentation and support resources will be displayed here.
        </p>
      </div>
    </div>
  );
}
