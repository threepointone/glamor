# threepointone/react-css

yet another attempt at css-in-js for react et al

This one uses the [CSSStyleSheet](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet)
api to add/remove css rules from a stylesheet object, using a generated hash of the
style description to index itself. This gives us some flexibility in generating
and combining css in a functional/react-y manner.

```jsx

import { style, hover, focus, nthChild, media } from '@threepointone/react-css'

// ...

<div {...style({ backgroundColor: 'blue' })>
  looks like inline css, but gets converted/cached as a css rule
  <ul {...nthChild(2, {outline: '1px solid black'})}>
    <li> one </li>
    <li> two - has outline! </li>
    <li> three </li>
  </ul>
  <a {...hover({ fontSize: 22 })} {...focus({ fontWeight: 'bold' })}>
    compose with a spread operator
  </a>
  <div {...media('(min-width: 700px) and (orientation: landscape)', hover({ color: 'black' }))}>
    media queries!
  </div>
</div>

```

features
---

- fairly efficient
- *doesn't* use `style`/`className` props
- supports all the pseudo selectors
- and media queries
- composes well

cons
---

- side-effecty, can lead to memory leaks with rapidly changing style objects
  - since we generate/add css rules to the dom as soon they're computed, style
  objects that change over *many different* values will leave behind unused rules in the dom. while
  there exists a function `remove` to remove rules based on the generated hash/refs,
  I can't think of a simple way to expose it. Hopefully this is an edge case and doesn't
  affect many people. If so, the recommendation is to use use regular
  `style` prop for styles that change over *many different* values.
- no tests/ real-world usage/ adoption


todo
---

- server side rendering
- generate css files for webpack etc
- typechecks (flow?)


profit, profit
---

I get it
