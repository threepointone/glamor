import React from 'react' //eslint-disable-line
import { render } from 'react-dom'
import { App } from './app'

let style = document.createElement('style');
(document.head || document.getElementsByTagName('head')[0]).appendChild(style)

let css = '.blue {background-color: blue;} .red {background-color: red;}'
if (style.styleSheet) {
  style.styleSheet.cssText = css
} else {
  style.appendChild(document.createTextNode(css))
}


render(<App/>, document.querySelector('#demo'))
