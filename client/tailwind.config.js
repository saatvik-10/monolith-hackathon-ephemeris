/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        solana: {
          dark: "#0B0F19",
          card: "#13111C",
          purple: "#9945FF",
          teal: "#14F195",
          muted: "#6B7280",
          text: "#E2E8F0",
        },
      },
    },
  },
  plugins: [],
};