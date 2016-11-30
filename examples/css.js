// inline css prop

import React from 'react'
import { cssFor, css } from 'glamor'

function log(x) {
  console.log((x || ''), this) // eslint-disable-line no-console
  return this
}


let someTag = '.xyz:hover'

css`opacity: 0.5`

let rule = css`

  /* real css! */
  + h1 { backgroundColor: black }
  color: yellow;
  :hover {
    /* with interpolations */
    color: ${ Math.random() > 0.5 ? 'red' : 'blue' };
  }

  & > h1 { color: purple }
  html.ie9 & ${someTag} { padding: 300px }

  /* and composition  */
  ${css`color: greenish`}
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

export const App = () => <div className={rule}>
  ...
</div>

import beautify from 'cssbeautify'
beautify(cssFor(rule))::log()
