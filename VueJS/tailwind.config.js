/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    screens: {
      'sm': '576px',
      'md': '768px',
      'lg': '992px',
      'xl': '1440px',
    },
    extend: {
      colors: {
        "theme-bg": "#121212",
        "primary": "#7350ff",
        "success": [
          {"text": '#d1eeac'},
          {"bg": "#344e41"}
        ],
        "danger": [
          {"text": "#f9ded1"},
          {"bg": "#4e3534"}
        ],
        "op": "#7c7c7c"
      },
      fontFamily: {
        "clashgrotesk": ['ClashGrotesk-Variable', 'sans-serif']
      },
      container: {
        screens: {
          'sm': '100%',
          'md': '768px',
          'lg': '992px',
          'xl': '1440px',
        },
        padding: {
          DEFAULT: '1rem',
        }
      },
    },
  },
  plugins: [],
}

