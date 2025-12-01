/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        board: {
          light: '#EBECD0',
          dark: '#739552',
          highlight: 'rgba(255, 255, 0, 0.5)',
          selected: 'rgba(255, 255, 51, 0.5)'
        }
      }
    },
  },
  plugins: [],
}
