import React from 'react'
import { style, hover } from '../lib'


let hoverBlue = hover([ { color: 'blue' }, { color: 'red' } ])
export function App() {
  return (
    <div {...hoverBlue}>
      hello!
    </div>
  )
}
