/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medblue: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3daeb',
          300: '#95c0de',
          400: '#60a0ce',
          500: '#3c84be',
          600: '#2b6ba1',
          700: '#245683',
          800: '#1e486d',
          900: '#0f2742',
          950: '#09182b',
        },
      },
    },
  },
  plugins: [],
}

