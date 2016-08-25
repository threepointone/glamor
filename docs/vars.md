`@vars()`

a decorator for css vars, inherited as they're applied deeper in the tree. 

```jsx

@vars()
class Button extends React.Component {                                      
  render() { // use available vars
    let { bgColor = 'gray', color ='white' } = this.props.vars // add defaults
    return <button {...style({ backgroundColor: bgColor, color })}>
      {this.props.children}
    </button>
  }
}

@vars({ bgColor: 'blue' }) // override / 'inherit' 
class ButtonGroup extends React.Component {                                       
  render() {
    return <div>
      <Button>one</Button>  
      <Button>two</Button>
    </div>  
  }
}

@vars({ bgColor: 'green' }) // green buttons in this branch
class LoginForm extends React.Component { 
  render() {
    return <div>
      <input value='ooga'/>
      <Button>login</Button>
    </div>  
  }
}


```
