import React from 'react'
import { placeholder, css } from 'glamor'


export class App extends React.Component {
  render() {
    return <input 
      {...placeholder({ color: 'red' })}
      {...css({ display: 'flex' })} 
      placeholder="some text" 
    />
  }  
}
