import {createElement} from '../../src/react' // eslint-disable-line
/** @jsx createElement */

import React from 'react'
import { vars } from '../../src/react'


import { Tweet } from './tweet'
import data from './data.json'

import { insertRule, merge, media } from '../../src'
import '../../src/reset'


let variables = {
  accent: '#1da1f2',
  animation: '#e81c4f',
  border: '#e1e8ed',
  primary: '#292f33',
  secondary: '#8899a6'
}

insertRule(`html {
  color: ${variables.primary};
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.3125;
}`)

insertRule(`a {
  text-decoration: none;
}`)

insertRule(`svg {
  fill: currentColor;
  height: 1.25em;
}`)

insertRule(`@media screen and (min-width: 360px) {
  html {
    font-size: 15px;
  }
}`)

insertRule(`@media screen and (min-width: 600px) {
  html {
    font-size: 16px;
  }
}`)

let container = merge({
  margin: '0 auto',
  width: '100%'
}, media('screen and (min-width: 360px)', {
  maxWidth: '400px'
}), media('screen and (min-width: 600px)', {
  maxWidth: '600px'
}))


@vars(variables)
export class App extends React.Component {
  render() {
    return <div css={container}>
      <Tweet data={data} />
    </div>  
  }
}
