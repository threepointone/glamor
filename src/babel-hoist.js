let packageName = 'glamor'


module.exports = ({ types: t }) => {
  return {
    visitor: {
      Program: {
        enter(path) {
          let isImported = false
          path.traverse({
            ImportDeclaration(path) {
              if (path.node.source.value === packageName) {
                const specifiers = path.get('specifiers')
                for (const specifier of specifiers) {
                  if (specifier.isImportSpecifier() && specifier.node.imported.name === 'css') {
                    isImported = true
                    break
                  }
                }
              }
            },
            CallExpression(path) {
              if (!path.get('callee').isIdentifier() || path.node.callee.name !== 'require') {
                return
              }
              const args = path.get('arguments')
              const arg = args[0]
              if (!arg || !arg.isStringLiteral() || arg.node.value !== packageName) {
                return
              }
              isImported = true // might cause false positives
            }
          })
          if(!isImported) {
            return
          }

          path.traverse({
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
                path.get('arguments').forEach(x => x.isPure() && x.hoist())
              }
            }
          })
        }
      }
    }
  }
}
