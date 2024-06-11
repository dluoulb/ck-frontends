/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#15191F",
        "secondary-gray": "#677283",
        "tertiary-gray": "#8A94A3",
        "primary-border-gray": "#CED5DE",
        "primary-blue": "#0066ff",
        "primary-blue-hover": "#094DB3",
        "secondary-blue": "#ECF3FE",
        disabled: "#ACB5C3",
        success: "#257436",
        "background-success": "#D9F2DF",
        error: "#A72525",
        "background-error": "#F6D5D5",
        "icon-error": "#7D1C1C",
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};
