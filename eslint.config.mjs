import antfu from "@antfu/eslint-config";

export default antfu(
  {
    stylistic: {
      semi: true,
      trailingComma: "all",
      singleQuote: false,
      quotes: "double",
    },
    typescript: true,
    vue: true,
    formatters: {
      css: true,
      markdown: true,
    },
    ignores: ["**/node_modules/**", "**/*.md"],
  },
  {
    files: ["**/*.vue"],
    rules: {
      "vue/operator-linebreak": ["error", "before"],
    },
  },
);
