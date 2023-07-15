/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        'primary': '#331D2C',
        'secondary': '#3F2E3E',
        'tertiary': '#A78295',
        'quaternary': '#EFE1D1',
      },
    },
    boxShadow: {
      profile: 'rgba(0, 0, 0,.5) 0px 20px 30px -10px',
    },
  },
  plugins: [],
  content: [
    './src/**/*{.js,.jsx,.ts,.tsx}',
    './index.html',
  ],
}

