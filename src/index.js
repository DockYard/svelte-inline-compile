const babel = require("@babel/core");
const babelPlugin = require("./babel-plugin");

module.exports = {
  name: "svelte-inline-compile",
  tranform(code) {
    return babel.transform(code, { plugins: [babelPlugin] }).code;
  },
};
