plugin system
---

glamor ships with a plugin system, allowing you to add custom transforms 
on selectors and styles before they get converted to css.

A plugin is a function that recieves `{ selector, style }`,
and is expected to return an object of the same shape. 

Here is an example plugin that adds ':any-link' support 
```jsx

function anyLink({ selector, style }) {
  selector = selector.split(',').map(x => x.trim())
    .forEach(p => {
      if(p.indexOf(':any-link') >=0 ) {
        result.push(p.replace(/\:any\-link/g, ':link'))
        result.push(p.replace(/\:any\-link/g, ':visited'))
      }
      else {
        result.push(p)
      }
    }).join(', ')
  return ({ selector, style })  
}

```

To add a plugin -
```jsx
import { plugins } from 'glamor'
plugins.add(anyLink)
```

NB: plugins are executed in the *opposite* order of insertion. So, if you've added `a` and `b`, `b` will get called before `a` ([#55](https://github.com/threepointone/glamor/issues/55))


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