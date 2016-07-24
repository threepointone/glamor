import React from 'react'

import { merge, media, visited, select, hover, style, simulate, addFont, stopSimulation } from '../../src'

import { latin, greek, cyrillic } from './OpenSans'

addFont(latin)
// addFont(greek)

export class App extends React.Component {
  render() {
    return <div {...media('(min-width: 500px)',
      merge( 'container',
        hover({ fontFamily: '"Open Sans"' }),
        select('#xyz', { color: 'red', background: 'gray' }),
        select('#abc', { color: 'blue' }),
        select('.bold', { fontWeight: 'bold' }),
        select('.big', { fontSize: 20 })
    ))}>
      <div>
        <div id="abc" className="bold big">blue</div>
        <div id="xyz">red!</div>
        <div></div>
      </div>
    </div>

  }
}
