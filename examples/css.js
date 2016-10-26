// inline css prop

import React from 'react'


import { cssFor, merge } from '../src'
import { css } from '../src/css'

function log(x) {
  console.log((x || ''), this) // eslint-disable-line no-console
  return this
}

  
let someTag = '.xyz:hover'

let rule = css`
  color: yellow; /* 'real' css syntax */
  /* pseudo classes */
  ${css`color: greenish`}
  :hover {
    /* just javascript */
    color: ${ Math.random() > 0.5 ? 'red' : 'blue' };
  }
  & > h1 { color: purple }
  /* contextual selectors */
  html.ie9 & ${someTag} { padding: 300px }
  /* compose with objects */
  /* or more rules */
  /* media queries */
  @media (min-width: 300px) {
    color: orange;
    border: 1px ${'solid'} blue;
    ${{ color: 'brown' }}
    /* increase specificity */
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
