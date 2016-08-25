// how to install the createElement shim

a drop-in replacement for React.createElement, allowing you to pass a `css` prop to dom elements. 

usage 

```jsx
import createElement from 'glamor/react'
/* @jsx createElement */

<div css={{ color: 'red' }}>
  I'm red!
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