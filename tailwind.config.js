/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./public/**/*.{html,js}"],
  theme: {
    screens: {
      'HD': '1920px',
      '2k': '2560px',
      '4k': '3840px',
    },
  },
  plugins: [],
}