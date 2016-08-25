plugin system
---

glamor ships with a plugin system, allowing you to add custom transforms 
on selectors and styles before they get converted to css.

A plugin is a function that recieves `{ id, selector, style, ...rest }`,
and is expected to return an object of the same shape. 

Here is an example plugin that adds ':any-link' support 
```jsx

function anyLink({ selector, ...rest }) {
  let pieces = selector.split(',').map(x => x.trim())
  let result = []
  pieces.forEach(p => {
    if(p.indexOf(':any-link') >=0 ) {
      result.push(p.replace(/\:any\-link/g, ':link'))
      result.push(p.replace(/\:any\-link/g, ':visited'))
    }
    else {
      result.push(p)
    }
  })
  return ({ selector: result.join(', '), ...rest })  
}

```

To add a plugin -
```jsx
import { plugins } from 'glamor'
plugins.inject(anyLink)
```

You can remove it with -
```jsx
plugins.remove(anyLink)
// or to clear all plugins 
plugins.clear()
```

plugins for vendor prefixes and array fallbacks are included by default. 


[todo] - plugins for @-rules - 
- media 
- keyframes 
- animation