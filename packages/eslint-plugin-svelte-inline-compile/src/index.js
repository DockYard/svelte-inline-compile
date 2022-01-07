const compiler = require("svelte/compiler");

module.exports = {
  rules: {
    "uses-vars": {
      create(context) {
        return {
          TaggedTemplateExpression(node) {
            if (node.tag.name === "svelte") {
              const template = node.quasi.quasis.map((quasi) => quasi.value.cooked).join("");
              const result = compiler.compile(template);
              result.warnings.forEach(w => {
                if (w.code === 'missing-declaration') {
                  const varName = w.message.match("^'([^']+)'")[1];
                  context.markVariableAsUsed(varName);
                }
              });
            }
          }
        };
      }
    }
  },
  configs: {
    recommended: {
      plugins: ['svelte-inline-compile'],
      rules: {
        'svelte-inline-compile/uses-vars': 2
      }
    }
  }
};
