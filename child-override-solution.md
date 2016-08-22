the problem
---

you have a base component that includes some styles. 
```jsx
class Button extends React.Component {
  render() {
    return <button {...this.props} {...style({ backgroundColor: 'blue' })}>
      {this.props.children}
    </button>
  }
}
```

Consumers of this component will want to style this component from any point of the hierarchy. 
- A `<Submit/>` button will want to add `{ fontSize: 20, color: 'white' }`
- The `<ButtonGroup/>` that includes it will want to adjust margins and border colors 
- The `<LoginForm/>` will add padding and perhaps a custom `fontFamily`
- This is further complicated by the fact that the `<LoginForm/>` is not a direct parent of the `<Button/>`

[(for more details)](https://medium.com/@taion/the-problem-with-css-in-js-circa-mid-2016-14060e69bf68)

This is a solution for react+glamor.

We expose static overrides to `<Button/>` styles with an override helper
```jsx
//button.js

import { override } from 'glamor/react'

export const btnStyle = override() 

@btnStyle.base()
class Button extends React.Component {
  render() {
    return <button {...this.props} {...merge(style({ backgroundColor: 'blue' }), this.props[btnStyle.name])}>
      {this.props.children}
    </button>
  }
}
```

alternately, we can move the default styling into `btnStyle.base`
```jsx
// btn.js

import { override } from 'glamor/react'

export const btnStyle = override() 

@btnStyle.base({ backgroundColor: 'blue' })
class Button extends React.Component {
  render() {
    return <button {...this.props} {...this.props[btnStyle.name]}>
      {this.props.children}
    </button>
  }
}
```

Now, at any point in the component tree, we can decorate components with styles to be merged into the button
```jsx
// btn-group.js
import { Button, btnStyle } from './btn.js'
import { hover, firstChild, lastChild, merge } from 'glamor'

@btnStyle.add(merge(
  hover({ backgroundColor: 'gray' }), 
  firstChild({ borderTopLeftRadius: 10 }), 
  lastChild({ borderTopRightRadius: 10 })
))
export class ButtonGroup extends React.Component {
  render() {
    return <div>
      <Button>one</Button>
      <Button>two</Button>
      <Button>three</Button>
    </div>
  }
}

// form.js
import { btnStyle } from './btn.js'
import { ButtonGroup } from './btn-group.js'
import { LoginButton } from './login-btn.js'

@btnStyle.add({ fontSize: 20, margin: 20 })
export class Form extends React.Component {
  render() {
    return <div>
      woah, where are the buttons?
      <ButtonGroup/>
      <LoginButton/> 
    </div>
  }
}

```
another option is to use a wrapper component in the render tree
```jsx
// btn-group.js

import { btnStyle } from './btn.js'
export class ButtonGroup extends React.Component {
  render() {
    return <div>
      <btnStyle.Override {...style({ borderTopLeftRadius: 10 })}>
        <Button>one</Button>
      </btnStyle.Override>
      <btnStyle.Override {...style({ borderTopRightRadius: 10 })}>
        <Button>two</Button>
      </btnStyle.Override>      
    </div>
  }
}
```

