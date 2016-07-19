# threepointone/react-css

yet another attempt at css-in-js for react et al

`npm install @threepointone/react-css --save`

This one uses the [CSSStyleSheet](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet)
api to add/remove css rules from a stylesheet object, using a generated hash of the
style description to index itself. This gives us some flexibility in generating
and combining styles in a functional/react-y manner. Further, we internally use data-* attributes
to annotate dom elements, leaving style/className untouched by our lib.

```jsx

import { style, hover, focus, nthChild, media } from '@threepointone/react-css'

// ...

<div {...style({ backgroundColor: 'blue' })}>
  looks like inline css, but gets converted/cached as a css rule
  <ul>
    <li> one </li>
    <li {...nthChild(2, {outline: '1px solid black'})}>
      two - has outline!
    </li>
    <li> three </li>
  </ul>
  <a {...hover({ fontSize: 22 })} {...focus({ fontWeight: 'bold' })}>
    compose with a spread operator
  </a>
  <div {...media('(min-width: 500px) and (orientation: landscape)', hover({ color: 'red' }))}>
    media queries!
  </div>
</div>
```

features
---

- fairly small / efficient
- lovely api, imo :)
- reuses common declarations
- _doesn't_ use `style`/`className` props
- supports all the pseudo selectors/elements
- and media queries
- simulate pseudo classes in development
- composes well
- tests / coverage
- server side rendering

cons
---

- side-effecty, can lead to memory leaks with rapidly changing style objects
  - since we generate/add css rules to the dom as soon they're computed, style
  objects that change over _many different_ values will leave behind unused rules in the dom. while
  there exists a function `remove` to remove rules based on the generated hash/refs,
  I can't think of a simple way to expose it. Hopefully this is an edge case and doesn't
  affect many people. If so, the recommendation is to use use regular
  `style` prop for styles that change over _many different_ values.
- no real-world usage/ adoption

server side rendering
---

this api is mostly copied from [aphrodite](https://github.com/Khan/aphrodite);
render your component inside of a callback, and react-css will gather all
the calls you used and return an object with html, css, and an object
to rehydrate the lib's cache

```jsx
// on the server
import { renderStatic } from '@threepointone/react-css'

let { html, css, cache } = renderStatic(() =>
  ReactDOMServer.renderToString(<App/>))

// ... when rendering your html
`<html>
  <head>
    <style>${css}</style>
  </head>
  <body>
    <div id='root'>${html}</div>
    <script>window._cssCache = ${JSON.stringify(cache)}</script>
    <script src="./bundle.js"></script>
  </body>
</html>`

// in your app startup

import { rehydrate } from '@threepointone/react-css'

rehydrate(window._cssCache)

ReactDOM.render(<App/>, document.getElementById('root'))

```


todo
---

- font face detection / on-demand loading
- hot loading support
- typechecks (flow? runtime?)
- compile time optimizations / statically generate css files alá jsxstyle
- other frameworks?
- theming et al


profit, profit
---

I get it
