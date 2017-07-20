// how to install the createElement shim

a drop-in replacement for React.createElement, allowing you to pass a `css` prop to elements. The props is converted to a className and added to the element.

usage 

```jsx
import { createElement } from 'glamor/react'
/* @jsx createElement */

<div css={{ color: 'red' }}>
  I'm red!
</div>
```

The props accepts arrays as well, so you could do 
```jsx
<div css={[{ color: 'red' }, someRule, { ... }]}> ... </div>
```

Use the following settings to avoid the `createElement` boilerplate 

`.babelrc`
---
```json
{
  ...
  "plugins": [
    [
      "transform-react-jsx",
      { "pragma": "Glamor.createElement" }
    ]
  ]
}
```
`webpack.config.js`
---
```js
...
plugins: [
  new webpack.ProvidePlugin({
    Glamor: 'glamor/react'
  })
]
```

typescript
---

If you're looking to make this work with typescript, [follow these instructions](https://github.com/threepointone/glamor/issues/283)