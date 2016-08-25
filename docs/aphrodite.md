aphrodite shim
--- 

glamor ships with a aphrodite-like StyleSheet api. 

usage - 
```jsx
import { createElement } from 'glamor/aphrodite'
/* @jsx createElement */

import { StyleSheet, css } from 'glamor/aphrodite'

let styles = StyleSheet.create({
  red: { color: 'red' },
  hoverBlue: {
    ':hover': { color: 'blue' }
  }
})

// ...
<div className={css(styles.red, style.hoverBlue)}>
  this is red, and turns blue on hover
</div>  
```

Use the following settings to avoid the `createElement` boilerplate 

`.babelrc`
---
```json
{
  "presets": [
    "es2015",
    "stage-0"
  ],
  "plugins": [
    [
      "transform-react-jsx",
      { "pragma": "createElement" }
    ]
  ]
}
```
`webpack.config.js`
---
```js
plugins: [
  new webpack.ProvidePlugin({
    createElement: 'glamor/aphrodite'
  })
]
```

a full example is [available](https://github.com/threepointone/glamor/blob/master/examples/aphrodite.js).