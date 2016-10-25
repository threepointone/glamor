import { parse } from './spec.js'
import { merge } from '../../src'

function log(x) {

  console.log((x || ''), this) // eslint-disable-line no-console
  return this
}

function stringify() {
  return JSON.stringify(this, null, ' ')
}

function convert(node, ctx) {
  return conversions[node.type](node, ctx)
}

export const conversions = {
  StyleSheet(node, ctx) {
    return node.rules.map(x => convert(x, ctx))
  },
  MediaRule(node, ctx) {
    let query = node.media.map(x => convert(x, ctx)).join(',')
    return { [`@media ${query}`]: node.rules.map(x => convert(x, ctx)) }
  },
  MediaQuery(node, ctx) {
    if(node.prefix) {
      return `${node.prefix} ${node.type} ${node.exprs.map(x => convert(x, ctx)).join(' ')}` 
    }
    else {
      return node.exprs.map(x => convert(x, ctx)).join(' ')
    }
  },
  MediaExpr(node, ctx) {
    if(node.value) {
      return `(${node.feature}:${node.value.map(x => convert(x, ctx))})`
    }
    return `(${node.feature})`
  },
  RuleSet(node, ctx) {
    let selector = node.selectors.map(x => convert(x, ctx)).join('')
    let x = { [selector]:  Object.assign({}, ...node.declarations.map(x => convert(x, ctx))) } // todo - more nesting, accept rules, etc 

    return x
  },
  Selector(node, ctx) {
    return `${convert(node.left, ctx)}${node.combinator}${convert(node.right, ctx)}`
  },
  SimpleSelector(node, ctx) {
    let ret = `${node.all ? '*' : (node.element !== '*' ? node.element : '' )}${node.qualifiers.map(x => convert(x, ctx)).join('')}`
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
    return { [node.name]: convert(node.value, ctx) }
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
    return convert(node.left, ctx) + (node.operator || ' ') + convert(node.right, ctx)
  },
  Stub(node, ctx) {
    return ctx.stubs[node.id]
  },
  Stubs(node, ctx) {
    return node.stubs.map(x => convert(x, ctx))
  }
}


export function css(strings, ...values) {
  let stubs = {}, ctr = 0
  strings = strings.reduce((arr, x, i) => {
    arr.push(x)
    if(values[i] === undefined || values[i] === null) {
      return arr
    }
    let j = ctr++
    stubs['spur-' + j] = values[i]
    arr.push('spur-' + j)

    return arr
  }, []).join('').trim()

  let parsed = parse(strings)
  return merge(convert(parsed, { stubs }))
}
