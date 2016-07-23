import React from 'react'

import { merge, media, visited, select, hover, style, simulate, add } from '../../src'

let red = style({ label: 'red', color: 'red' }),
  hoverBlue = hover({ label: 'blue', color: 'blue' }),
  text = merge(red, hoverBlue),
  container = merge(text, visited({ fontWeight: 'normal' }),
    { color: 'gray' }),
  mq = media('(min-width: 500px)', text)

export class App extends React.Component {
  render() {
    return <div {...mq}/>
      
  }
}
