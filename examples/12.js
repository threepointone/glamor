import React from 'react'
import { media, merge, hover } from '../src'

export class App extends React.Component {
  render() {
    return <div {...media('(min-width: 500px)', 
      merge( 'container', 
        merge('newish',
          { color: 'red' }, 
          hover({ color: 'blue' }))))} />
  }
}
