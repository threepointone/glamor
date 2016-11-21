// inline css prop

import React from 'react'
import { cssFor, css } from 'glamor'

function log(x) {
  console.log((x || ''), this) // eslint-disable-line no-console
  return this
}


let someTag = '.xyz:hover'

let rule = css`
  color: yellow;
  :hover {
    /* with interpolations */
    color: ${ Math.random() > 0.5 ? 'red' : 'blue' };
  }

  & > h1 { color: purple }
  html.ie9 & ${someTag} { padding: 300px }

  /* and composition */
  ${css`color: greenish`}

  @media (min-width: 300px) {
    color: orange;
    border: 1px ${'solid'} blue;
    ${{ color: 'brown' }}
    && {
      color: blue;
      ${{ color: 'browner' }}
    }
  }
`

export const App = () => <div className={rule}>
  ...
</div>

import beautify from 'cssbeautify'
beautify(cssFor(rule))::log()
