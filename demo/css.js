// inline css prop
import React from 'react'
import { hover } from '../src'

export class App extends React.Component {
  render() {
    return <div css={hover({ color: 'red' })}>
      what what
    </div>
  }
}

