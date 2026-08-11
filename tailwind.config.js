/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1C1B1F',
        paper: '#FAF9F6',
        moss: {
          50: '#F1F5EE',
          100: '#DCE7D3',
          300: '#A9C494',
          500: '#5C7A4E',
          600: '#4A6440',
          700: '#3A4F32',
        },
        clay: '#C97C5D',
        ember: '#B0492E',
        line: '#E4E1D8',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        soft: '0 2px 10px rgba(28, 27, 31, 0.06)',
      },
    },
  },
  plugins: [],
};
