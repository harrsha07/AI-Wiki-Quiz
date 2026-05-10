/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        bright: {
          "primary": "#7C3AED",
          "secondary": "#EC4899",
          "accent": "#14B8A6",
          "neutral": "#1e293b",
          "base-100": "#ffffff",
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      {
        darkmagic: {
          "primary": "#A855F7",
          "secondary": "#22D3EE",
          "accent": "#818CF8",
          "neutral": "#0F172A",
          "base-100": "#1E293B",
          "info": "#38BDF8",
          "success": "#34D399",
          "warning": "#FBBF24",
          "error": "#F87171",
        },
      },
    ],
  },
}