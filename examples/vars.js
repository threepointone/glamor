import React from 'react'
import { css } from '../src'
import { vars } from '../src/react'            


@vars({
  color: 'black', // top-level declarations
  bgColor: 'pink'
})
export class App extends React.Component {
  render() {
    return <div>
      <ButtonGroup/>
      <LoginForm/>
    </div>
  }
}

@vars()
class Button extends React.Component {                                      //eslint-disable-line
  render() { // use available vars ath this point
    let { bgColor = 'gray', color ='white' } = this.props.vars
    return <button {...css({ backgroundColor: bgColor, color })}>
      {this.props.children}
    </button>
  }
}

@vars({ bgColor: 'blue' }) // override / 'inherit' 
class ButtonGroup extends React.Component {                                       //eslint-disable-line
  render() {
    return <div>
      <Button>one</Button>  
      <Button>two</Button>
    </div>  
  }
}

@vars({ bgColor: 'green' }) // green buttons in this branch
class LoginForm extends React.Component {                                         //eslint-disable-line
  render() {
    return <div>
      <input value="ooga"/>
      <Button>login</Button>
    </div>  
  }
}
