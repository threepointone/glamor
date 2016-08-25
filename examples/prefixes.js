import React from 'react'
import { placeholder } from '../src'

export class App extends React.Component {
  render() {
    return <input 
      {...placeholder({ color: 'red' })} 
      placeholder="some text" 
    />
  }  
}
