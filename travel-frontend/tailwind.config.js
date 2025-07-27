/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",      // <- Include if using /pages
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // <- For components
    "./src/**/*.{js,ts,jsx,tsx,mdx}",        // <- using /src
  ],
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
