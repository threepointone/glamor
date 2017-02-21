// a babel plugin that strips out the tagged literal syntax,
// and replaces with a json form. everybody wins!
// we can do this because we control the ast
// and there's a corresponding json representation for every kv pair / nesting form

// replace interpolations with stubs
// parse to get intermediate form
// print back, replacing stubs with interpolations
// tada?

// todo - custom function instead of merge
let { parse } = require('./spec.js')

function convert(node, ctx, interpolated) {
  if(interpolated && node.type === 'Stub') {
    return '${' + conversions[node.type](node, ctx, interpolated) + '}'
  }
  return conversions[node.type](node, ctx, interpolated)
}

function toCamel(x) {
  return x.replace(/(\-[a-z])/g, $1 => $1.toUpperCase().replace('-',''))
}

let conversions = {
  StyleSheet(node, ctx) {
    return '[ ' + node.rules.map(x => convert(x, ctx)).join(', ') + ' ]'
  },
  MediaRule(node, ctx) {
    let query = node.media.map(x => convert(x, ctx, true)).join(',')
    let mq = query.indexOf('${') >= 0 ? `[\`@media ${query}\`]` : `'@media ${query}'`
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
  AttributeSelector(node, ctx) {
    return `[${node.attribute}${node.operator ? node.operator + node.value : ''}]`
  },
  Function(node, ctx) {
    return `${node.name}(${convert(node.params, ctx)})`
  },
  Declaration(node, ctx) {
    // todo - fallbacks
    let val = convert(node.value, ctx, true)
    let icky = false;
    [ '${', '\'', '"' ].forEach(x => {      
      icky = icky || ((val + '').indexOf(x) >= 0)
    })
    val = icky ? `\`${val}\`` : `'${val}'`
    if(node.value.type === 'Stub') {
      val = convert(node.value, ctx)
    }
    return `{ '${node.name.indexOf('--') === 0 ? node.name : toCamel(node.name)}': ${val} }` // todo - numbers 
  },
  Quantity(node, ctx) {
    return (node.value.type === 'Stub' ? convert(node.value, ctx) : node.value)  + node.unit
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
    if(ctx.withProps) {
      return 'val(' + ctx.stubs[node.id] + ', props)'  
    }
    return ctx.stubs[node.id]
    
  },
  Stubs(node, ctx) {
    return node.stubs.map(x => convert(x, ctx))
  }
}

function parser(path) {
  let code = path.hub.file.code
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
  return { parsed, stubs: stubCtx }
}

module.exports = {
  visitor: {
    TaggedTemplateExpression(path) {
      let { tag } = path.node            
      let code = path.hub.file.code

      if(tag.name === 'css') {
        let { parsed, stubs } = parser(path)        
        let newSrc = 'css(' + convert(parsed, { stubs }) + ')'
        path.replaceWithSourceString(newSrc)
      }
      else if(tag.type === 'CallExpression' && tag.callee.name === 'styled') {
        let { parsed, stubs } = parser(path)
        let newSrc = 'styled(' + code.substring(tag.arguments[0].start, tag.arguments[0].end) +', (val, props) => (' + convert(parsed, { stubs, withProps: true }) + '))'
        path.replaceWithSourceString(newSrc)
      }
      else if(tag.type === 'MemberExpression' && tag.object.name === 'styled') {
        let { parsed, stubs } = parser(path)
        let newSrc = 'styled(\'' + tag.property.name +'\', (val, props) => (' + convert(parsed, { stubs, withProps: true }) + '))'
        path.replaceWithSourceString(newSrc) 
      }
    }
  }
}
