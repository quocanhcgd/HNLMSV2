/** @type {import('tailwindcss').Config} */
// Design Tokens theo docs/13-mockups/design-governance.md §2 — map vào theme.extend.
module.exports = {
  darkMode: 'class', // html.dark (giống mockup: class 'dark' trên <html>)
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0d9488',
        'primary-light': '#5eead4',
        secondary: '#10b981',
        accent: '#f59e0b',
        purple: '#8b5cf6',
        pink: '#ec4899',
        danger: '#dc2626',
      },
    },
  },
  plugins: [],
};
