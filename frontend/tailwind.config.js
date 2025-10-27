/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm beige palette (from provided image)
        beige800: '#A67A5B', // le plus foncé
        beige600: '#C19770',
        beige400: '#D5B895',
        beige200: '#E8DCB5',
        beige100: '#FAF0DC', // le plus clair
        dark: '#0D0D0D',
        white: '#FFFFFF'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        logo: ['"Sedgwick Ave Display"', 'cursive']
      }
    }
  },
  plugins: []
};
