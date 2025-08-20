"use client";

export default function AboutPage() {
  return (
    <div
      className="about-container flex-1 w-full flex items-center justify-center font-sans px-6 py-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div
        className="about-card p-8 rounded-2xl max-w-xl"
        style={{
          backgroundColor: "var(--bg-surface)",
          boxShadow: "var(--shadow-large)",
        }}
      >
        <h1
          className="about-title text-3xl font-bold text-center mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          ABOUT
        </h1>
        <p
          className="about-text leading-relaxed mb-4 text-justify"
          style={{ color: "var(--text-primary)" }}
        >
          This is the About page of our application. Here we share information
          about the purpose of this project, our goals, and the team behind it.
        </p>
        <p
          className="about-text leading-relaxed text-justify"
          style={{ color: "var(--text-primary)" }}
        >
          Built with Next.js and styled with a soft, neumorphic theme, this app
          is designed to be clean, responsive, and easy to use across devices.
        </p>
      </div>
    </div>
  );
}
