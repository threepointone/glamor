import React from 'react'
import { createElement } from '../src/react' // eslint-disable-line
/* @jsx createElement */

export class App extends React.Component {
  render() {
    return <Button css={{ color: 'red' }}> hello world</Button>
  }
}

class Button extends React.Component {
  render() {    
    return <button {...this.props} />
  }
}
