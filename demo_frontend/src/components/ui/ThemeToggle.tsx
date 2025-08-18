"use client";

import { useState, useEffect } from "react";
import { Lightbulb, LightbulbOff } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      applyDarkTheme();
    }
  }, []);

  const applyDarkTheme = () => {
    document.body.style.background = "#2a2d3a";
    document.documentElement.style.background = "#2a2d3a";

    const main = document.querySelector("main");
    if (main) {
      main.style.background = "#2a2d3a";
    }

    const header = document.querySelector("header");
    if (header) {
      header.style.background = "linear-gradient(to bottom, #7c3aed, #2a2d3a)";
    }

    const footer = document.querySelector("footer");
    if (footer) {
      footer.style.background = "linear-gradient(to top, #7c3aed, #2a2d3a)";
    }

    const footerText = document.querySelector("footer span") as HTMLElement;
    if (footerText) {
      footerText.style.color = "#c4b5fd";
    }
  };

  const applyLightTheme = () => {
    document.body.style.background = "#e0e5ec";
    document.documentElement.style.background = "#e0e5ec";

    const main = document.querySelector("main");
    if (main) {
      main.style.background = "#e0e5ec";
    }

    const header = document.querySelector("header");
    if (header) {
      header.style.background =
        "linear-gradient(to bottom, rgb(191 219 254), #e0e5ec)";
    }

    const footer = document.querySelector("footer");
    if (footer) {
      footer.style.background =
        "linear-gradient(to top, rgb(191 219 254), #e0e5ec)";
    }

    const footerText = document.querySelector("footer span") as HTMLElement;
    if (footerText) {
      footerText.style.color = "#60a5fa";
    }
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      applyDarkTheme();
      localStorage.setItem("theme", "dark");
    } else {
      applyLightTheme();
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-3 rounded-xl font-bold transition-all duration-150 ${
        isDark
          ? "bg-[#2a2d3a] shadow-[6px_6px_10px_#1e2028,-5px_-5px_10px_#363a4c] hover:bg-[#2e3240]"
          : "bg-[#e0e5ec] shadow-[6px_6px_10px_#c2c8d0,-5px_-5px_10px_#e6f0fa] hover:bg-blue-100"
      }`}
    >
      {isDark ? (
        <Lightbulb size={20} className="text-purple-300" />
      ) : (
        <LightbulbOff size={20} className="text-blue-300" />
      )}
    </button>
  );
}
