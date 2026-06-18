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
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          card: "var(--bg-card)",
          dark: "var(--bg-dark)",
        },
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        info: "var(--info)",
        highlight: "var(--highlight)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        glow: {
          primary: "var(--glow-primary)",
          secondary: "var(--glow-secondary)",
          accent: "var(--glow-accent)",
        }
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
        neon: "0 0 15px rgba(0, 245, 255, 0.3)",
      },
      backdropBlur: {
        glass: "20px",
      },
    },
  },
  plugins: [],
}
