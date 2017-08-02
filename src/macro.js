const css = require('./css/babel');
const hoist = require('./babel-hoist');

module.exports = function macro({ references, babel }) {
  const program = references.css[0].findParent((path) => path.type === 'Program');

  const { types: t } = babel;
  const importSpecifier = t.importSpecifier(t.identifier('css'), t.identifier('css'));
  const importDeclaration = t.importDeclaration([importSpecifier], t.stringLiteral('glamor'));
  program.unshiftContainer('body', importDeclaration);

  const hoistVisitor = hoist.hoistVisitor(t);

  references.css.forEach((path) => {
    path.parentPath.parentPath.traverse(css.visitor);

    // if (process.env.NODE_ENV === 'production') {
      path.parentPath.parentPath.traverse(hoistVisitor);
    // }
  });
}