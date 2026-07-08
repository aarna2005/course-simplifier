/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        ibm: {
          blue:       "#0f62fe",
          "blue-dark":"#0043ce",
          "blue-light":"#4589ff",
          teal:       "#009d9a",
          purple:     "#8a3ffc",
          cyan:       "#1192e8",
          green:      "#198038",
          yellow:     "#f1c21b",
          orange:     "#ff832b",
          red:        "#da1e28",
          gray: {
            10:  "#f4f4f4",
            20:  "#e0e0e0",
            30:  "#c6c6c6",
            50:  "#8d8d8d",
            70:  "#525252",
            90:  "#262626",
            100: "#161616",
          },
        },
      },
    },
  },
  plugins: [],
};
