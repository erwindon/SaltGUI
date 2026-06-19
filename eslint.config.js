// eslint.config.js
import pluginCompat from "eslint-plugin-compat";

const baseConfig = {
  plugins: {
    compat: pluginCompat,
  },

  rules: {
    "array-element-newline": 0,
    "arrow-body-style": ["error", "as-needed"],
    "capitalized-comments": 0,
    "class-methods-use-this": 2,
    "compat/compat": "error",
    "complexity": 0,
    "curly": ["error", "all"],
    "dot-notation": 0,
    "func-names": ["error", "always"],
    "function-call-argument-newline": 0,
    "function-paren-newline": 0,
    "guard-for-in": 0,
    "id-length": ["error", { "exceptions": ["i"] }],
    "indent": ["error", 2],
    "init-declarations": 0,
    "keyword-spacing": "warn",
    "line-comment-position": ["error", { "ignorePattern": "NOSONAR", "position": "above" }],
    "max-classes-per-file": "off",
    "max-depth": ["error", 4],
    "max-len": "off",
    "max-lines": "off",
    "max-lines-per-function": "off",
    "max-params": "off",
    "max-statements": "off",
    "multiline-comment-style": "off",
    "multiline-ternary": "off",
    "no-bitwise": "error",
    "no-console": "error",
    "no-continue": "off",
    "no-extra-parens": ["error"],
    "no-inline-comments": ["error", { "ignorePattern": "NOSONAR" }],
    "no-invalid-this": "error",
    "no-labels": "error",
    "no-lonely-if": "error",
    "no-loss-of-precision": "off",
    "no-magic-numbers": "off",
    "no-mixed-operators": "off",
    "no-param-reassign": "off",
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "no-redeclare": "error",
    "no-self-assign": ["error", { "props": true }],
    "no-ternary": "off",
    "no-undef": "error",
    "no-undef-init": "error",
    "no-undefined": "off",
    "no-underscore-dangle": "off",
    "no-unused-vars": ["error", { "args": "all", "caughtErrors": "all", "vars": "all" }],
    "no-warning-comments": "off",
    "object-property-newline": "off",
    "object-shorthand": "off",
    "one-var": "off",
    "padded-blocks": "off",
    "prefer-destructuring": "off",
    "prefer-named-capture-group": "off",
    "prefer-object-spread": "error",
    "prefer-template": "off",
    "require-unicode-regexp": "off",
    "sort-keys": ["error", "asc", { "caseSensitive": true, "natural": false }],
    "space-before-function-paren": ["error", "always"]
  }
};

export default [
  baseConfig,

  // the application runs in the browser and therefore uses the ES version
  // that was current 5 years ago, so that older browsers keep working
  {
    files: ["saltgui/static/scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    }
  },

  // the tests run in nodejs and not in a browser,
  // so they may use a newer ES version
  // this version may not be lower than the web-application
  // this version may be increased at any moment without notice
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    }
  }
];
