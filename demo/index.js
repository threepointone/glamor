// import Stats from 'stats.js'
import 'react-hot-loader/patch'
import Redbox from 'redbox-react'

import React from 'react' //eslint-disable-line
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import { App } from './app'

let make = App =>
  <AppContainer errorReporter={Redbox}><App/></AppContainer>

render(make(App),
  document.querySelector('#demo'))

if (module.hot) {
  module.hot.accept('./app', () => {
    render(make(require('./app').App),
      document.querySelector('#demo'))
  })
}

