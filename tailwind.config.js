/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: 'class',
  // Support for light mode using class selector
  // When .light class is on html element, light: variants will apply
  corePlugins: {
    preflight: true,
  },
}
