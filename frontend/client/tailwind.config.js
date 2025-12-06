// frontend/client/tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        "fao-blue": "#005c8a",
        "fao-blue-dark": "#003d5c",
        "fao-blue-light": "#e6f0f5",

        "fao-green": "#78b643",
        "fao-green-dark": "#4f8a32",
        "fao-green-light": "#e9f5e3",

        "fao-gray": "#f5f7fa",
        "fao-gray-dark": "#d9dde2",

        "fao-text": "#2a2a2a",
        "fao-muted": "#6b7785",
      },
    },
  },
};
