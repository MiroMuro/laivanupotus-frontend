import { transform } from "typescript";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        "battleship-blue": "#0A213D",
        "battleship-blue-light": "#0d2c52",
        "battleship-blue-lighter": "#294363",
        "battleship-blue-dark": "#051221",
        "battleship-blue-darker": "#02060d",
      },
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
      },
      backgroundImage: {
        battleships: "url('/src/assets/background_warships.jpeg')",
      },
      keyframes: {
        fadeInAndOut: {
          "0%": { opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "error-message-fade": "fadeInAndOut 10s linear forwards",
      },
    },
    plugins: [],
  },
};
