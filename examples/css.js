// inline css prop

import React from 'react'
import { css as cssFoo } from '../src/macro'

function log(x) {
  console.log((x || ''), this) // eslint-disable-line no-console
  return this
}


let someTag = '.xyz:hover'

cssFoo`opacity: 0.5`

let rule = cssFoo`
  /* real css! */
  + h1 { backgroundColor: black }
  h1.title & { color: blue }
  [something^='123'] {color: blue}
  color: yellow;
  :hover {
    /* with interpolations */
    color: ${ Math.random() > 0.5 ? 'red' : 'blue' };
  }

  & > h1 { color: purple }
  html.ie9 & ${someTag} { padding: 300px }

  /* and composition  */
  ${cssFoo`color: greenish`}
  --custom: --xyz;
  background-color: var(--main-bg-color, something);
  @media (min-width: 300px) {
    color: orange;
    height:100vh;
    width: 300;

    border: ${1}px ${'solid'} blue;
    ${{ color: 'brown' }}
    && {
      color: blue;
      ${{ color: 'browner' }}
    }
  }
  margin: 0
`

export const App = () => <div className={cssFoo`${rule}; font-size: 10em`}>
  ...
</div>
