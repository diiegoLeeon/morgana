/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#004AEC',
        secondary: '#001E4B',
        background: '#09111D',
      },
      boxShadow: {
        neon: '0 0 5px theme("colors.primary"), 0 0 20px theme("colors.secondary")',
      },
      textShadow: {
        neon: '0 0 5px theme("colors.primary")',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-neon': {
          textShadow: '0 0 5px #004AEC',
        },
      };
      addUtilities(newUtilities);
    },
  ],
  darkMode: 'class',
};