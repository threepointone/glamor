import React from 'react'

import { select, hover, style, simulate, add } from '../../src'


export class App extends React.Component {
  render() {
    return <div {...select('ul li:nth-child(even)', { color: 'red' })}>
      <ul>
        <li>one</li>
        <li>two - red!</li>
        <li>three</li>
      </ul>
    </div>
  }
}
