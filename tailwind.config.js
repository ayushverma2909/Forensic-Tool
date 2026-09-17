/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0B0E12",
          panel: "#12161C",
          alt: "#171C23",
          raised: "#1C222A",
        },
        border: {
          DEFAULT: "#232B34",
          light: "#2E3944",
        },
        ink: {
          DEFAULT: "#E7ECF1",
          dim: "#98A5B3",
          faint: "#5C6A78",
        },
        forensic: {
          cyan: "#3FBBD6",
          blue: "#4C8EDA",
        },
        success: "#3ECF8E",
        warn: "#E5A542",
        crit: "#E5555C",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 2px 8px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
}

