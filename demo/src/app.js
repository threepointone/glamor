import React from 'react'

import { style, hover, focus, simulate } from '../../src'

export class App extends React.Component{
  render() {
    return <div>
      <h1 {...hover({backgroundColor: 'red'})} {...simulate('hover')}>
        react-css demo
      </h1>
    </div>
  }
}
