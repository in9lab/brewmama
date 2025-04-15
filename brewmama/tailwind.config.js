/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 酿酒相关的主题色
        'brew-amber': '#F59E0B',
        'brew-brown': '#92400E',
        'brew-gold': '#EAB308',
        'brew-cream': '#FEF3C7',
        'brew-dark': '#292524',
      },
    },
  },
  plugins: [],
} 