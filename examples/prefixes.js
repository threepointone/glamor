import React from 'react'
import { placeholder, style } from '../src'


export class App extends React.Component {
  render() {
    return <input 
      {...placeholder({ color: 'red' })}
      {...style({ display: 'flex' })} 
      placeholder="some text" 
    />
  }  
}
