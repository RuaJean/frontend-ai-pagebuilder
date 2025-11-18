/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f6ff',
          100: '#dfe8ff',
          200: '#bcd1ff',
          300: '#8aaeff',
          400: '#5683ff',
          500: '#2e5fff',
          600: '#1d47db',
          700: '#1637ab',
          800: '#142f85',
          900: '#132a6b',
        },
      },
      boxShadow: {
        card: '0 10px 25px -10px rgba(15, 23, 42, 0.25)',
      },
    },
  },
  plugins: [],
};
