import React from 'react'
import { render } from 'react-dom'

import { hover, focus } from '../../src'

let Demo = () =>
  <div>
    <h1 {...hover({backgroundColor: 'red'})}>
      pseudoclasses Demo
    </h1>
  </div>

render(<Demo/>, document.querySelector('#demo'))
