module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    allowImportExportEverywhere: true,
    "allowImportExportEverywhere": true
  },
  plugins: [
    'react',
  ],
  rules: {
  },
  "settings": {
    "import/resolver" : {
      "alias" : {
        "map" : [
          ["components","./frontend/src/"]
        ],
        "extensions": [".js", ".jsx"]
      }
    }
  }
};
