/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dual-tone color palette based on screenshots
        primary: {
          teal: '#4ECDC4',
          'teal-light': '#A8E6CF',
          'teal-dark': '#2E8B8B',
          'teal-accent': '#A8E6CF',
        },
        secondary: {
          charcoal: '#2C3E50',
          'charcoal-light': '#34495E',
          'charcoal-dark': '#1A252F',
        },
        neutral: {
          'gray-light': '#BDC3C7',
          'gray-medium': '#95A5A6',
          'gray-dark': '#7F8C8D',
          white: '#FFFFFF',
          'bg-light': '#F8FFFE',
        }
      }
    },
  },
  plugins: [],
};