// https://bugs.chromium.org/p/chromium/issues/detail?id=639561

import React from 'react'
import { css } from '../src'

css.insert('[data-abc]:hover { color: red; }')

export class App extends React.Component {
  render() {
    return <div>
      <div>one</div>
      <div data-abc>two</div>
    </div>
  }
}
