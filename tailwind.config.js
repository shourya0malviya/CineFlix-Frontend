/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cineRed: "#E50914",
        cineDark: "#0a0a0a",
        cinePanel: "#141414",
        cinePanel2: "#1a1a1a",
        cineMuted: "#8a8a8a",
      },
      fontFamily: {
        display: ['"Bebas Neue"', "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(229,9,20,0.4), 0 10px 30px rgba(229,9,20,0.25)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
