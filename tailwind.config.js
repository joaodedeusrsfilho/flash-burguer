/** @type {import('tailwindcss').Config} */
module.exports = {
  //dentro do content vamos informar onde está os arquivos que vão usar o tailwindcss

  content: ["./**/*.{html,js}"],//qualquer arquivo na pasta raiz ou nas subpastas
  theme: {
    fontFamily:{
      'sans': ['Poppins', 'sans-serif']
    },
    extend: {
      backgroundImage:{
        "home":"url('/assets/bg.png')"
      }
    },
  },
  plugins: [],
}

