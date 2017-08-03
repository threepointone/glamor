const { convertCSSTaggedTemplateExpression } = require('./css/babel');
const { hoistCallExpression } = require('./babel-hoist');

module.exports = function macro({ references, babel }) {
  const firstReference = references.css[0];
  if (!firstReference) return;

  const program = firstReference.findParent((path) => path.type === 'Program');

  const { types: t } = babel;

  const importSpecifier = t.importSpecifier(t.identifier(firstReference.node.name), t.identifier('css'));
  const importDeclaration = t.importDeclaration([importSpecifier], t.stringLiteral('glamor'));
  program.unshiftContainer('body', importDeclaration);

  references.css.forEach((path) => {
    const parentPath = path.parentPath;

    parentPath.parentPath.traverse({
      TaggedTemplateExpression(p) {
        convertCSSTaggedTemplateExpression(p, path.node.name);
      }
    });

    if (parentPath.type === 'CallExpression') {
      hoistCallExpression(parentPath);
    }
  });
}