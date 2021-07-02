const babel = require("@babel/core");
const fs = require("fs");
const path = require("path");
const plugin = require("../src");

it("replaces svelte tagged templates with a compiled Svelte component", () => {
  let input = fs.readFileSync(
    path.join("test", "fixtures", "simple", "input.js"),
    "UTF8"
  );
  let output = fs.readFileSync(
    path.join("test", "fixtures", "simple", "output.js"),
    "UTF8"
  );

  const { code } = babel.transform(input, { plugins: [plugin] });

  expect(code).toBe(output);
});
