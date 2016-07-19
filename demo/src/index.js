import React from 'react'
import { render } from 'react-dom'

import { style, hover, focus } from '../../src'

let Demo = () =>
  <div>
    <h1 {...style({backgroundColor: 'red'})}>
      react-css demo
    </h1>
  </div>

render(<Demo/>, document.querySelector('#demo'))
