// https://bugs.chromium.org/p/chromium/issues/detail?id=639561

import React from 'react'
import { insertRule } from '../src'

insertRule('[data-abc]:hover { color: red; }')

export class App extends React.Component {
  render() {
    return <div data-abc></div>
  }
}
