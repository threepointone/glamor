// inline css prop

import React from 'react'

import { createElement } from '../src/react' // eslint-disable-line no-unused-vars
/** @jsx createElement */

import { hover } from '../src'

export class App extends React.Component {
  render() {
    return <div css={hover({ color: 'red', label: 'woo' })}>
      what what
    </div>
  }
}

