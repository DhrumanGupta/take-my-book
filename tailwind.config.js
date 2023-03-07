module.exports = {
  content: [
    // "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    // "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      orange: "var(--color-orange)",
      blue: "var(--color-blue)",
      darkOrange: "var(--color-orange-dark)",
      white: "var(--color-white)",
      black: "var(--color-black)",
      gray: {
        light: "var(--color-gray-light)",
        dark: "var(--color-gray-dark)",
      },
      red: "var(--color-red)",
    },
    extend: {
      height: {
        112: "28rem",
        128: "32rem",
      },
      keyframes: {
        vslide: {
          "0%": { height: 0 },
          "100%": { height: "100%" },
        },
      },
      animation: {
        vslide: "vslide 10s ease-in-out",
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
    require("@tailwindcss/aspect-ratio"),
  ],
};
