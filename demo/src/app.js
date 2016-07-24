import React from 'react'

import { merge, media, visited, select, hover, style, simulate, addFont } from '../../src'

// let x = addFont({
//   fontFamily: 'xxyyzz',
//   fontStyle: 'normal',
//   fontWeight: 400,
//   src: "url(https://fonts.gstatic.com/s/opensans/v13/K88pR3goAWT7BTt32Z01m4X0hVgzZQUfRDuZrPvH3D8.woff2) format('woff2')"
// })
//
// console.log(x)

export class App extends React.Component {
  render() {
    return <div {...merge(
      style({ fontFamily: 'xxyyzz' }),
      select('#xyz', { color: 'red', background: 'gray' }),
      select('#abc', { color: 'blue' }),
      select('.bold', { fontWeight: 'bold' }),
      select('.big', { fontSize: 20 })
    )}>
      <div>
        <div id="abc" className="bold big">blue</div>
        <div id="xyz">red!</div>
        <div></div>
      </div>
    </div>

  }
}
