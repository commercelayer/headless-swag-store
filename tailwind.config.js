module.exports = {
  theme: {
    extend: {
      gridTemplateRows: {
        "[auto,auto,1fr]": "auto auto 1fr",
      },
    },
  },
  variants: {
    extend: {
      borderColor: ["checked"],
    },
  },
  plugins: [
    // ...
    require("@tailwindcss/aspect-ratio"),
  ],
};
