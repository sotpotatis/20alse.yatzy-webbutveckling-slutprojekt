/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,html}"],
  theme: {
    extend: {
      fontFamily: { // Lägg in anpassade typsnitt
        main: ["Poppins", "sans-serif"],
        dyslexic: ["OpenDyslexicRegular", "sans-serif"]
      },
      colors: { // Lägg in färger
        background: "#6B7280"
      }
    },
  },
  plugins: [],
}
