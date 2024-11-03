/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7dff00',
          dark: '#5cb300'
        }
      },
      animation: {
        'spin-slow': 'spin 5s ease-out',
      }
    },
  },
  plugins: [],
};