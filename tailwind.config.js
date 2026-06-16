/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#050816",
          secondary: "#0A0F2C",
          card: "rgba(255, 255, 255, 0.04)",
        },
        primary: "#00E5FF",
        secondary: "#7C3AED",
        accent: "#00FFA3",
        text: {
          primary: "#FFFFFF",
          secondary: "#94A3B8",
          muted: "#4A5568",
        },
        glow: {
          primary: "rgba(0, 229, 255, 0.3)",
          secondary: "rgba(124, 58, 237, 0.3)",
        }
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
      },
      backdropBlur: {
        glass: "20px",
      },
    },
  },
  plugins: [],
}
