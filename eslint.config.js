import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["_site/**", "node_modules/**"] },
  js.configs.recommended,
  {
    // Build-time / Node code (config, scripts, data, schemas).
    files: [
      "eslint.config.js",
      "eleventy.config.js",
      "scripts/**/*.js",
      "helper/**/*.js",
      "src/_11ty/**/*.js",
      "src/schemas/**/*.js",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
  },
  {
    // Client runtime (browser).
    files: ["src/js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
    },
    rules: {
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
];
