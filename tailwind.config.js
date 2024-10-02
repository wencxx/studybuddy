/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html', './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter']
      },
      colors: {
        colors: {
          primary: '#020420'
        }
      }
    },
  },
  plugins: [],
}

