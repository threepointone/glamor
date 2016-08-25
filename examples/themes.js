import React from 'react'
import { makeTheme } from '../src/react'

export class App extends React.Component {
  render() {
    return <div>
      <ButtonGroup />
      <InlineForm big/>
    </div>
  }
}

let theme = makeTheme()

@theme({ backgroundColor: 'blue' })  
// optional defaults
class Button extends React.Component {                                            //eslint-disable-line
  render() {
    return <button {...this.props[theme.key]}>
      {this.props.children}
    </button>
  }
}

@theme.add({ color: 'white' })
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
@theme.add(props => ({ fontSize: props.big ? 20 : 12 }))                        //eslint-disable-line
class InlineForm extends React.Component {                            //eslint-disable-line
  render() {
    return <div>
      <Button>one</Button>
      <Button>two</Button>
    </div>
  }
}

