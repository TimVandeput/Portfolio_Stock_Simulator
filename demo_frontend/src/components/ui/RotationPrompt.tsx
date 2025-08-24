"use client";

import { RotateCcw } from "lucide-react";

export default function RotationPrompt() {
  return (
    <div
      className="fixed inset-0 z-[9999] hidden max-lg:landscape:flex flex-col items-center justify-center p-4"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <RotateCcw
        className="w-16 h-16 mb-4 animate-pulse"
        style={{ color: "var(--text-primary)" }}
      />
      <h2 className="text-xl font-bold mb-2 text-center">
        Please Rotate Your Device
      </h2>
      <p className="text-center text-sm opacity-80">
        This app is designed for portrait orientation
      </p>
    </div>
  );
}
