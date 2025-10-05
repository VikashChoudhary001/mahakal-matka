/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0098c7",
        orange: "#d80522",
        greenLight: "#4cb050",
      },
      fontFamily: {
        poppins: "Poppins",
        hindi: ["Noto Sans Devanagari", "Inter", "Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
