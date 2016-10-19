import { parse } from './spec'

export const convert = {
  StyleSheet() {

  },
  MediaRule() {

  },
  RuleSet() {

  },
  Selector() {

  },
  SimpleSelector() {

  },
  Contextual() {

  },
  IDSelector() {

  },
  ClassSelector() {

  },
  AttributeSelector() {

  },
  Function() {

  },
  Declaration() {

  },
  Quantity() {

  },
  String() {

  },
  URI() {

  },
  Ident() {

  },
  Hexcolor() {

  }
}

export function css(strings) {
  return parse(strings.join('').trim())
}

console.log(JSON.stringify( //eslint-disable-line no-console
css` 
  color: yellow;
  html {
    color: red;
  }
  @media all, or, none {
    color: orange;
    html {
      color: blue;
      border: 1px solid blue
    }
  }
  & :hover.xyz {
    color: green
  }
  `, null, ' '))

