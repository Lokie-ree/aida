const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // shadcn/ui theme colors (CSS variables)
      colors: {
        // Pelican AI Brand Colors
        "pelican-blue": "hsl(var(--pelican-blue))",
        "louisiana-gold": "hsl(var(--louisiana-gold))",
        "deep-blue": "hsl(var(--deep-blue))",
        
        // shadcn/ui theme colors
        border: "hsl(var(--border))",
        "border-border": "hsl(var(--border))", // Add border-border utility
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        primary: ["Lexend", "system-ui", "sans-serif"], // Brand primary font
        heading: ["Poppins", "system-ui", "sans-serif"], // Brand heading font
        mono: ["JetBrains Mono", "Courier New", "monospace"], // Brand monospace font
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
