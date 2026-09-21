/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0E3A45',
          accent: '#FF7A59',
          neutral: '#FAF9F6',
          textH: '#16191A',
          textB: '#4A5256',
          success: '#2E8B6F',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        display: ['var(--font-plus-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(14, 58, 69, 0.08)',
        'soft-hover': '0 10px 30px -4px rgba(14, 58, 69, 0.12)',
      }
    },
  },
  plugins: [],
}
