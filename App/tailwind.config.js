/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#d6d2d5", 
          200: "#ada5ab",
          300: "#857780",
          400: "#5c4a56",
          500: "#331d2c",
          600: "#291723",
          700: "#1f111a",
          800: "#140c12",
          900: "#0a0609"
          },
        secondary: {
          100: "#d9d5d8",
          200: "#b2abb2",
          300: "#8c828b",
          400: "#655865",
          500: "#3f2e3e",
          600: "#322532",
          700: "#261c25",
          800: "#191219",
          900: "#0d090c"
        },
        tertiary: {
          100: "#ede6ea",
          200: "#dccdd5",
          300: "#cab4bf",
          400: "#b99baa",
          500: "#a78295",
          600: "#866877",
          700: "#644e59",
          800: "#43343c",
          900: "#211a1e"
        },
        quaternary: {
          100: "#fcf9f6",
          200: "#f9f3ed",
          300: "#f5ede3",
          400: "#f2e7da",
          500: "#efe1d1",
          600: "#bfb4a7",
          700: "#8f877d",
          800: "#605a54",
          900: "#302d2a"
        }
      },
    },
    boxShadow: {
      profile: 'rgba(0, 0, 0,.5) 0px 20px 30px -10px',
      card: 'rgba(0, 0, 0,.3 ) 0px 20px 30px -10px',
    },
  },
  plugins: [
    require('@tailwindcss/container-queries')
  ],
  content: [
    './src/**/*{.js,.jsx,.ts,.tsx}',
    './index.html',
  ],
}

