import React from 'react'
import { render } from 'react-dom'
import { App } from './react'
import { App as ThemesExample } from './themes'
import { App as VarsExample } from './vars'

render(
<div>
  <App/>
  <br />
  <br />
  <ThemesExample />
  <br />
  <br />
  <VarsExample />
</div>,
  document.querySelector('#demo'))
