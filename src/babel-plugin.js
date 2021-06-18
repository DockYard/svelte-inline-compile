const compiler = require("svelte/compiler");

module.exports = function (_babel) {
  return {
    visitor: {
      TaggedTemplateExpression(path) {
        const tag = path.get("tag");

        if (!tag.isIdentifier({ name: "svelte" })) return;

        const template = path.node.quasi.quasis
          .map((quasi) => quasi.value.cooked)
          .join("");

        const componentSrc = compiler
          .compile(template, { format: "cjs" })
          .js.code.replace("exports.default =", "return");

        path.replaceWithSourceString(`(function () { ${componentSrc} })()`);
      },
    },
  };
};
