/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        frimart: {
          blue: "#0066cc",
          dark: "#003b7a"
        },
        huerta: {
          green: "#15803d",
          light: "#22c55e"
        }
      }
    },
  },
  plugins: [],
}
