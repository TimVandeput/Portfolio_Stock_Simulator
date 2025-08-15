"use client";

export default function AboutPage() {
  return (
    <div className="flex-1 w-full flex items-center justify-center bg-[#e0e5ec] font-sans px-6 py-6">
      <div className="bg-[#e0e5ec] p-8 rounded-2xl shadow-[10px_10px_15px_#c2c8d0,-5px_-5px_10px_#e6f0fa] max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-300">
          About
        </h1>
        <p className="text-blue-400 leading-relaxed mb-4">
          This is the About page of our application. Here we share information
          about the purpose of this project, our goals, and the team behind it.
        </p>
        <p className="text-blue-400 leading-relaxed">
          Built with Next.js and styled with a soft, neumorphic theme, this app
          is designed to be clean, responsive, and easy to use across devices.
        </p>
      </div>
    </div>
  );
}
