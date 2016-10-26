// a babel plugin that strips out the tagged literal syntax,
// and replaces with a json form. everybody wins!
// we can do this because we control the ast
// and there's a corresponding json representation for every kv pair / nesting form

// replace interpolations with stubs
// parse to get intermediate form
// print back, replacing stubs with interpolations
// tada?

// let template = require('babel-template')
let { parse } = require('./spec.js')

function convert(node, ctx, interpolated) {
  if(interpolated && node.type === 'Stub') {
    return '${' + conversions[node.type](node, ctx, interpolated) + '}'
  }
  return conversions[node.type](node, ctx, interpolated)
}

let conversions = {
  StyleSheet(node, ctx) {
    return 'merge([ ' + node.rules.map(x => convert(x, ctx)).join(', ') + ' ])'
  },
  MediaRule(node, ctx) {
    let query = node.media.map(x => convert(x, ctx, true)).join(',')
    let mq = query.indexOf('${') >= 0 ? `[\`@media ${query}\`]` : `'@media ${query}'`
    // return { [`@media ${query}`]: node.rules.map(x => convert(x, ctx)) }
    return `{ ${mq}: [ ${node.rules.map(x => convert(x, ctx)).join(', ')} ] }`
  },
  MediaQuery(node, ctx) {
    if(node.prefix) {
      return `${node.prefix} ${node.type} ${node.exprs.map(x => convert(x, ctx, true)).join(' ')}` 
    }
    else {
      return node.exprs.map(x => convert(x, ctx, true)).join(' ')
    }
  },
  MediaExpr(node, ctx) {
    if(node.value) {
      return `(${node.feature}:${node.value.map(x => convert(x, ctx, true))})`
    }
    return `(${node.feature})`
  },
  RuleSet(node, ctx) {
    let selector = node.selectors.map(x => convert(x, ctx, true)).join('')
    let declarations = node.declarations.map(x => convert(x, ctx))
    let declStr = declarations.length > 1 ? `[ ${declarations.join(', ')} ]` : declarations
    if(selector.indexOf('${') >= 0) {
      selector = `[\`${selector}\`]`
    }
    else {
      selector = `'${selector}'`
    }
    let x = `{ ${selector}: ${declStr} }` // todo - more nesting, accept rules, etc 

    return x
  },
  Selector(node, ctx) {
    return `${convert(node.left, ctx, true)}${node.combinator}${convert(node.right, ctx, true)}`
  },
  SimpleSelector(node, ctx) {
    let ret = `${node.all ? '*' : (node.element !== '*' ? node.element : '' )}${node.qualifiers.map(x => convert(x, ctx, true)).join('')}`
    return ret
  },
  Contextual() {
    return '&'
  },
  IDSelector(node, ctx) {
    return node.id
  },
  ClassSelector(node, ctx) {
    return '.' + node['class']
  },
  PseudoSelector(node, ctx) {
    return ':' + node.value
  },
  AttributeSelector() {

  },
  Function() {

  },
  Declaration(node, ctx) {
    // todo - fallbacks
    let val = convert(node.value, ctx, true)
    let icky = false;
    [ '${', '\'', '"' ].forEach(x => {
      icky = icky || (val.indexOf(x) >= 0)
    })
    val = icky ? `\`${val}\`` : `'${val}'`
    if(node.value.type === 'Stub') {
      val = convert(node.value, ctx)
    }
    return `{ '${node.name}': ${val} }` // todo - numbers 
  },
  Quantity(node) {
    return node.value + node.unit
  },
  String(node) {
    return node.value
  },
  URI(node) {
    return `url(${node.value})`
  },
  Ident(node) {
    return node.value
  },
  Hexcolor(node) {
    return node.value
  },
  Expression(node, ctx) {
    return convert(node.left, ctx, true) + (node.operator || ' ') + convert(node.right, ctx, true)
  },
  Stub(node, ctx) {
    return ctx.stubs[node.id]
  },
  Stubs(node, ctx) {
    return node.stubs.map(x => convert(x, ctx))
  }
}

module.exports = {
  visitor: {
    TaggedTemplateExpression(path) {
      
      let code = path.hub.file.code 
      if(path.node.tag.name === 'css') {
        let stubs = path.node.quasi.expressions.map(x => code.substring(x.start, x.end))          
        let stubCtx = stubs.reduce((o, stub, i) => (o['spur-' + i] = stub, o), {})
        let ctr = 0
        let strs = path.node.quasi.quasis.map(x => x.value.cooked)
        let src = strs.reduce((arr, str, i) => {
          arr.push(str)
          if(i !== stubs.length) {
            arr.push('spur-'+ctr++)
          }
          return arr
        }, []).join('')
        let parsed = parse(src.trim())
        let newSrc = convert(parsed, { stubs: stubCtx })      
        path.replaceWithSourceString(newSrc)
      }
    }    
  }
}
