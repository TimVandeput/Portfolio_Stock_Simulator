"use client";

import DynamicIcon from "./DynamicIcon";
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation";

export default function RotationPrompt() {
  const { shouldShow } = useDeviceOrientation();

  if (!shouldShow) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <DynamicIcon
        iconName="rotate-ccw"
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
