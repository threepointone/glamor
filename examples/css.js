// inline css prop

import React from 'react'
import { hover } from '../src'
import { createElement } from '../src/react' // eslint-disable-line no-unused-vars
/** @jsx createElement */

export class App extends React.Component {
  render() {
    return <div css={hover({ color: 'red', label: 'woo' })}>
      what what
    </div>
  }
}

