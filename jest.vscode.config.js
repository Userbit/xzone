// This config file for VSCode is included in ./project.code-workspace
// RESTART VSCODE AFTER CHANGING IT!
const thisPackage = require("./package.json");

// Extend or override Jest Config options in package.json for Jest extension in VSCode
const jestVSCodeConf = {
  collectCoverage: true,
  reporters: [["jest-simple-dot-reporter", { color: true }]],
};

module.exports = {
  ...thisPackage.jest,
  ...jestVSCodeConf,
};
