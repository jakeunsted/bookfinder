/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3FC0F3',
        'secondary': '#001011',
        'accent': '#0D9BD3'
      }
    },
  },
  plugins: [],
}

