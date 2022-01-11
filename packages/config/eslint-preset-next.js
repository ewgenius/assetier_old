module.exports = {
  extends: ["plugin:@typescript-eslint/recommended", "prettier"],

  // settings: {
  //   next: {
  //     rootDir: ["apps/web/"],
  //   },
  // },

  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],

  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@next/next/no-html-link-for-pages": "off",
    "@next/next/no-page-custom-font": "off",
  },
};
