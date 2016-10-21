import { parse } from './spec'

export const convert = {
  StyleSheet(node) {  
    let ret = {}
    // todo - deep merging 
    node.rules.forEach((rule) => {
      Object.assign(ret, convert[rule.type](rule))
    })
    return ret
    
  },
  MediaRule(node) {
    return { ['@media ' + node.media.join(',')]: Object.assign({}, ...node.rules.map(x => convert[x.type](x))) }
  },
  RuleSet(node) {
    let x = { [node.selectors.map(x => convert[x.type](x)).join('')]: Object.assign({}, ...node.declarations.map(x => convert[x.type](x))) }
    return x
  },
  Selector(node) {
    return `${convert[node.left.type](node.left)}${node.combinator}${convert[node.right.type](node.right)}`
  },
  SimpleSelector(node) {
    let ret = `${node.all ? '*' : (node.element !== '*' ? node.element : '' )}${node.qualifiers.map(x => convert[x.type](x)).join('')}`    
    return ret
  },
  Contextual() {
    return '&'
  },
  IDSelector(node) {
    return node.id
  },
  ClassSelector(node) {
    return '.' + node['class']
  },
  PseudoSelector(node) {
    return ':' + node.value
  },
  AttributeSelector() {

  },
  Function() {

  },
  Declaration(node) {
    // todo - fallbacks
    return { [node.name]: convert[node.value.type](node.value) }
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
  Expression(node) {
    return convert[node.left.type](node.left) + (node.operator || ' ') + convert[node.right.type](node.right)
  }
}

export function css(strings, ...values) {  
  strings = strings.reduce((arr, x, i) => {
    arr.push(x)
    arr.push(values[i])
    return arr
  }, []).join('').trim()
  let parsed = parse(strings)
  return convert[parsed.type](parsed)
}


css` 
  color: yellow;
  html & {
    color: red;    
  }
  @media all, or, none {
    color: orange;
    html & {
      color: blue;
      border: 1px solid blue
    }
  }
  & :hover.xyz {
    color: green
  }
`

