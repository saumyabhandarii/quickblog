/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1', // or any custom primary color you want
      },
      zIndex: {
        '-10': '-10',
      },
      scale: {
        '102': '1.02',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
