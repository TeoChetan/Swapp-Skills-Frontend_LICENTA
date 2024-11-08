/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily:{
        montserrat: ['"Montserrat"', ...defaultTheme.fontFamily.sans]
      },
      colors:{
        'blue-nova':'#5b6d92',
        'polar-sky':'#d6d6d6',
        'gray-custom':'#c0c4c4',
        'yellow':"#FFF455",
        'blue-navy':"#00152c",
        'light-green':"#ACD793",
        'overlay': 'rgba(0, 0, 0, 0.2)'

      },
      rotate: {
        '180': '180deg',
      },
      width: {
        'card': '500px'
      },
      height: {
        'card': '500px' 
      },
      backgroundImage: {
        'chat-background': "url('./Assets/chatbackground.jpg')",
      }
    },
  },
  plugins: [],

}