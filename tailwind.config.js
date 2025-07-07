/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['var(--font-cairo)'],
      },
      colors: {
        primary: {
          DEFAULT: '#ff4b6e',
          dark: '#ff4b6e',
        },
        background: {
          light: '#ffffff',
          dark: '#1a1625',
        },
        foreground: {
          light: '#000000',
          dark: '#ffffff',
        },
        card: {
          light: '#ffffff',
          dark: '#241b2f',
        },
        border: {
          light: '#e5e7eb',
          dark: '#2d2139',
        },
      },
    },
  },
  plugins: [],
} 