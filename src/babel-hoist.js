module.exports = ({ types: t }) => {
  return {
    visitor: {
      JSXIdentifier(path) {
        if (path.node.name !== 'css') return
        if (!t.isJSXAttribute(path.parent)) return // avoid elements named `css`

        const expr = path.parentPath.get('value.expression')
        if (!expr.isObjectExpression) return

        if (expr.isPure()) {
          expr.hoist()
        }
      },
      CallExpression(path) {
        let { node } = path
        if(node.callee.name === 'css' && node.callee.type === 'Identifier') {
          path.node.get('arguments').forEach(x => x.isPure() && x.hoist())
        }
      }
    }
  }
}
