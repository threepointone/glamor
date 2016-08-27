// import Stats from 'stats.js'
import 'react-hot-loader/patch'
import Redbox from 'redbox-react'

import React from 'react' //eslint-disable-line
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import { App } from './tweet'

let make = App =>
  <AppContainer errorReporter={Redbox}>
    <App/>
  </AppContainer>

render(make(App),
  document.querySelector('#demo'))

if (module.hot) {
  module.hot.accept('./tweet', () => {
    render(make(require('./tweet').App),
      document.querySelector('#demo'))
  })
}

// import React from 'react' //eslint-disable-line
// import { render } from 'react-dom'
// import { App } from './12'
// render(<App/>,
//   document.querySelector('#demo'))
