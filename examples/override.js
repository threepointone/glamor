import React from 'react'
import { hover } from '../src'
import { override } from '../src/react'


let buttonStyle = override()

@buttonStyle.base({ backgroundColor: 'blue' })  
// optional defaults
class Button extends React.Component {                                            //eslint-disable-line
  render() {
    return <button {...this.props[buttonStyle.name]}>
      {this.props.children}
    </button>
  }
}

@buttonStyle.add({ color: 'white' })
// can do cumulative overrides! 
// the 'higher' components get higher precedence 
class ButtonGroup extends React.Component {                           //eslint-disable-line
  render() {
    return <div>
      <Button>one</Button>
      <Button>two</Button>
      <Button>three</Button>
    </div>
  }
}

// can also pass a function if based on props
@buttonStyle.add(props => ({ fontSize: 20 }))                        //eslint-disable-line
class InlineForm extends React.Component {                            //eslint-disable-line
  render() {
    return <div>
      <Button>one</Button>
      <Button>two</Button>
    </div>
  }
}

