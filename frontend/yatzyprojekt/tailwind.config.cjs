/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        // Lägg in anpassade typsnitt
        main: ["Poppins", "sans-serif"],
        dyslexic: ["OpenDyslexicRegular", "sans-serif"],
      },
      colors: {
        // Lägg in färger
        background: "#6B7280",
        gold: "#FFD700",
        silver: "#C0C0C0",
        bronze: "#CD7F32",
      },
      zIndex: {
        60: "60",
      },
    },
  },
  plugins: [
    require("tailwindcss-3d")({ legacy: true }), // Används för 3D-kuber.
  ],
};
