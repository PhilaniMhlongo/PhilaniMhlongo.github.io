/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        surface: {
          elevated: "hsl(var(--surface-elevated))",
        },
        terminal: {
          bg: "#0D1117",
          surface: "#161B22",
          border: "#30363D",
          blue: "#2F81F7",
          green: "#7EE787",
          text: "#F0F6FC",
          muted: "#8B949E",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "SFMono-Regular", "Consolas", "monospace"],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        /* density-first spacing */
        pane: "12px",
        panel: "16px",
        section: "24px",
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(48,54,61,0.4)",
        elevated: "0 4px 12px rgba(0,0,0,0.24)",
      },
      transitionTimingFunction: {
        mechanical: "cubic-bezier(0.2, 0, 0, 1)",
      },
      transitionDuration: {
        120: "120ms",
        150: "150ms",
      },
      gridTemplateColumns: {
        dashboard: "280px minmax(0, 1fr)",
        terminal: "minmax(0, 1fr) 380px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};