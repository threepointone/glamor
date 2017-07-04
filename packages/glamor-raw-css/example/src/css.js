// inline css prop

import React from 'react'
import { cssFor, css } from 'glamor'
import beautify from 'cssbeautify'

function log(x) {
  console.log((x || ''), this) // eslint-disable-line no-console
  return this
}


let someTag = '.xyz:hover'

css`opacity: 0.5`

let rule = css`
  /* real css! */
  + h1 { backgroundColor: black }
  h1.title & { color: blue }
  [something^='123'] {color: blue}
  color: yellow;
  :hover {
    /* with interpolations */
    color: ${ Math.random() > 0.5 ? 'red' : 'blue'};
  }

  & > h1 { color: purple }
  html.ie9 & ${someTag} { padding: 300px }

  /* and composition  */
  ${css`color: greenish`}
  
  background-color: var(--main-bg-color, something);
  @media (min-width: 600px) {
    color: orange;
    height:100vh;
    width: 300;
    
    border: ${1}px ${'solid'} blue;
    ${{ color: 'brown' }}
    && {
      color: blue;
      ${{ color: 'green' }}
    }
  }
  margin: 0
`

export const App = () => <div className={rule}>
  {
    beautify(cssFor(rule))
  }
</div>
