import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        light: {
          bg: "#e0e5ec",
          surface: "#e0e5ec",
          primary: "#60a5fa",
          secondary: "#93c5fd",
          text: "#60a5fa",
          accent: "#3b82f6",
        },
        dark: {
          bg: "#2a2d3a",
          surface: "#2a2d3a",
          primary: "#c4b5fd",
          secondary: "#a78bfa",
          text: "#c4b5fd",
          accent: "#7c3aed",
        },
        shadow: {
          light: {
            outer: "#c2c8d0",
            inner: "#e6f0fa",
          },
          dark: {
            outer: "#1e2028",
            inner: "#363a4c",
          },
        },
      },
      boxShadow: {
        "neu-light": "6px 6px 10px #c2c8d0, -5px -5px 10px #e6f0fa",
        "neu-light-inset":
          "inset 2px 2px 5px rgba(0,0,0,0.25), inset -2px -2px 5px rgba(255,255,255,0.7)",
        "neu-dark": "6px 6px 10px #1e2028, -5px -5px 10px #363a4c",
        "neu-dark-inset":
          "inset 2px 2px 5px #1e2028, inset -2px -2px 5px #363a4c",
      },
    },
  },
  plugins: [],
};

export default config;
