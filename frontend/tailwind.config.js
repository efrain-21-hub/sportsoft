/** @type {import('tailwindcss').Config} */
export default {
  // Le dice a Tailwind qué archivos escanear para generar las clases CSS
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",   // Todos los archivos JS y JSX dentro de src/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}