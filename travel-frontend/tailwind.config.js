/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: {
          50: "#f0f9ff",
        },
      },
      backgroundImage: {
        "gradient-sunset": "linear-gradient(to right, #ec4899, #f59e0b)",

        "gradient-travel": "linear-gradient(to right, #0ea5e9, #6366f1)",
      },
    },
  },
  plugins: [],
};
