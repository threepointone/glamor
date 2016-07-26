import React from 'react'

import { merge, media, animation, visited, select, hover, style, simulate, fontFace } from '../../src'

import { latin, greek, cyrillic } from './OpenSans'

let font = fontFace(latin)
// addFont(greek)

let animate = animation('bounce', {
  '0%': {
    transform: 'scale(0.1)',
    opacity: 0
  },
  '60%': {
    transform: 'scale(1.2)',
    opacity: 1
  },
  '100%': {
    transform: 'scale(1)'
  }
})


export class App extends React.Component {
  render() {
    return <div {...simulate('hover')} {...media('(min-width: 500px)',
      merge( 'container',
        hover({ fontFamily: font }),
        select('#xyz', { color: 'red', background: 'gray' }),
        select('#abc', { color: 'blue' }),
        select('.bold', { fontWeight: 'bold' }),
        select('.big', { fontSize: 20 })
    ))}>
      <div {...style({
        animation: `${animate} 2s`
      })}>
        <div id="abc" className="bold big">blue</div>
        <div id="xyz">red!</div>
      </div>
    </div>

  }
}
