import React from 'react'
import { render } from 'react-dom'
import { App } from './shorthand'
import { App as TransitionGroupExample } from './transitiongroup'
import { App as ParentSelectorExample } from './parent'
// import { App as PerfExample } from './perf'

render(
<div>
  <App/>
  <br />
  {/*<PerfExample />*/}
  {/*<br />*/}
  <ParentSelectorExample />
  <br />
  <br />
  <TransitionGroupExample />
</div>,
  document.querySelector('#demo'))
