/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brandBlue: '#0873d1',
        brandGreen: '#86c91f',
        brandInk: '#09131f',
      },
    },
  },
  plugins: [],
}
