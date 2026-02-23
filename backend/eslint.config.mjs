import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  pluginJs.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        process: "readonly",
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "preserve-caught-error": "off",
    }
  }
];