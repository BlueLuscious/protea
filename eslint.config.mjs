import tseslint from "typescript-eslint";

/**
 * @description Focused authored-source rules for Protea contributor configuration and TypeScript.
 */
const sourceRules = {
  curly: ["error", "all"],
  eqeqeq: ["error", "always"],
  "no-debugger": "error",
  "no-eval": "error",
  "no-unsafe-finally": "error",
  quotes: [
    "error",
    "double",
    { avoidEscape: true, allowTemplateLiterals: true },
  ],
  semi: ["error", "always"],
};

export default [
  {
    ignores: ["**/node_modules/**", "plans/**"],
  },
  {
    files: ["**/*.{ts,mjs}"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module" },
    rules: sourceRules,
  },
  {
    files: ["**/*.ts"],
    languageOptions: { parser: tseslint.parser },
  },
];
