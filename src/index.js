const babel = require("@babel/core");
const babelPlugin = require("./babel-plugin");

module.exports = function tranform(code) {
  return babel.transform(code, { plugins: [babelPlugin] });
};
