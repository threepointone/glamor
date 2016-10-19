import { parse } from './spec'

export function css(strings) {
  return parse(strings.join('').trim())
}

console.log(JSON.stringify(css`
  color: yellow;
  html {
    color: red;
  }
  @media all, or, none {
    color: orange;
    html {
      color: blue;
    }
  }
  & :hover.xyz {
    color: green
  }
  `, null, ' '))

