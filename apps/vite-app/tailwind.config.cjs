/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/ui-components/dist/index.js",
    "../../node_modules/ui-components/dist/index.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
