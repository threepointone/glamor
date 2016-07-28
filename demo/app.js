import React from 'react'
function log(msg) { //eslint-disable-line no-unused-vars
  console.log(msg || this) //eslint-disable-line no-console
  return this
}

function makeRandomColor() {
  return '#'+Math.random().toString(16).substr(-6)
}

import { merge, media, keyframes, select, hover, style, simulate, fontFace, keyed } from '../src'

// throwaway 
keyed('something', { color: 'red' })

export class App extends React.Component {
  render() {
    return <div {...keyed('ele', { backgroundColor: 'red' })} onClick={() => keyed('ele', { backgroundColor: makeRandomColor() })}>
      something
    </div>
    
  } 
}
