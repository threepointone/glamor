import { parse } from './spec'
import beautify from 'cssbeautify'
import { style, cssFor, select, merge, media } from '../../src'

function log(x) {

  console.log((x || ''), this) // eslint-disable-line no-console
  return this
}

function stringify() {
  return JSON.stringify(this)
}

function convert(node, ctx) {
  return conversions[node.type](node, ctx)
}

export const conversions = {
  StyleSheet(node, ctx) {
    return merge(node.rules.map(x => convert(x, ctx)))
  },
  MediaRule(node, ctx) {
    return media(node.media.join(','), node.rules.map(x => convert(x, ctx)))
  },
  RuleSet(node, ctx) {
    // let selector =
    let x = select(node.selectors.map(x => convert(x)).join(''),  Object.assign({}, ...node.declarations.map(x => convert(x, ctx))))

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
  }
}

export function css(strings, ...values) {
  let stubs = {}, ctr = 0
  strings = strings.reduce((arr, x, i) => {
    arr.push(x)
    if(values[i] === undefined || values[i] === null) {
      return arr
    }
    if([ 'number', 'string', 'boolean' ].indexOf(typeof values[i]) >= 0) {
      arr.push(values[i])
    }
    else {
      let j = ctr++
      stubs['spur-' + j] = values[i]
      arr.push('spur-' + j + ';')
    }

    return arr
  }, []).join('').trim()

  let parsed = parse(strings)
  // replace stubs here
  // JSON.stringify(parsed, null, ' ')::log()
  return convert(parsed, { stubs })
}

let rule = css`
  color: yellow;
  ${{ color: 'gray' }}      /* compose with objects */
  ${css` color: white; `}   /* or more rules */
  :hover {                  /* pseudo classes */
    color: ${ Math.random() > 0.5 ? 'red' : 'blue'};  /* just javascript */
  }
  html.ie9 & span { padding: 10 } /* contextual selectors */
  @media all, or, none {    /* media queries */
    color: orange;
    && {              /* increase specificity */
      color: blue;
    }
  }
`::log()


beautify(cssFor(rule))::log()
