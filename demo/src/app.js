import React from 'react'

import { merge, media, visited, select, hover, style, simulate, add } from '../../src'

let red = style({ label: 'red', color: 'red' }),
  hoverBlue = hover({ label: 'blue', color: 'blue' }),
  text = merge(red, hoverBlue),
  container = merge(text, visited({ fontWeight: 'bold' }),
    { color: 'gray' }),
  mq = media('(min-width: 500px)', text)

export class App extends React.Component {
  render() {
    return <div {...container}>
      <ul {...style({ label: 'mylist' })}>
        <li {...hover({ color: 'green' })}>one</li>
        <li >two</li>
        <li {...mq}>three</li>
      </ul>
    </div>
  }
}
