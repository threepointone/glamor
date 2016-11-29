api
---

## `css(...rules)`
---

In glamor, css rules are treated as values. The `css` function lets you define these values. 

This a 'rule'
```css
.abc { color: red }
```

These rules can be grouped to form more rules
```css
/* this is a combined rule for .abc */
.abc { color: red }
.abc:hover { color: blue }
html.ie9 .abc span.title { font-weight: bold }
@media(min-width: 300px) { 
  .abc { font-size: 20 }
} 
```

We can write this in javascript
```jsx
import { css } from 'glamor'

let abc = css({
  color: 'red',
  ':hover': { color: 'blue' },  
  'html.ie9 & span.title': { fontWeight: 'bold' }, 
  '@media(min-width: 300px)': { fontSize: 20 }
})
```


Combine multiple rules
```jsx
let combined = css(
  abc, 
  { color: 'blue', ':after': { content: '"..."'} }, 
  { ':hover': { textDecoration: 'underline' } },
  someOtherRule,
  // ...more
)
```

- glamor will make sure that rules are merged in the correct order, 
managing nesting and precedence for you. [(Learn more about selectors and nesting)](https://github.com/threepointone/glamor/blob/master/docs/selectors.md) 
- There are a number of helpers to simplify creating rules. [See the full list here](https://github.com/threepointone/glamor/blob/master/docs/helpers.md)
- in dev mode, adding a `label` string prop will reflect its value in devtools. useful when debugging.


You can use these rules with elements 
```jsx
// as classes
<div className={abc}>
  hello world
</div>

// or props
<div {...abc}>
  hello world
</div>
```


Define fallback values for browsers that don't support features
```jsx
let gray = css({
  color: ['#ccc', 'rgba(0, 0, 0, 0.5)']
})
```
is equivalent to
```css
.gray {
  color: #ccc;
  color: rgba(0, 0, 0, 0.5)
}
```


---


## `css.global(selector, style)`/ `css.insert(css)` 

append a raw css rule at most once to the stylesheet. the ultimate escape hatch.

```jsx
// these don't 'return' anything, 
// can't nest selectors, do
// *cannot* be combined with other rules.

css.global('html, body', { padding: 0 })
// or if prefer raw css and/or need media queries etc 
// send one rule at a time 
css.insert('html, body { padding: 0 }')
css.insert('@media print {...}')

```


## `css.fontFace(font)`

loads the given font-face at most once into the document, returns the font family name

```jsx
let family = css.fontFace({
  fontFamily: 'Open Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  src: "local('Open Sans'), local('OpenSans'), url(https://fonts.gstatic.com/s/...ff2')",
  unicodeRange: "U+0000-00FF, U+0131, ... U+E0FF, U+EFFD, U+F000"
})
// ...
<div {...style({ fontFamily: family })}>
  no serifs!
</div>
```

for anything more complicated, use something like [typography.js](https://kyleamathews.github.io/typography.js/)

---

## `css.keyframes(timeline)`

adds animation keyframes into the document, with an optional name.

```jsx
let bounce = css.keyframes('bounce', { // optional name
  '0%': { transform: 'scale(0.1)', opacity: 0 },
  '60%': { transform: 'scale(1.2)', opacity: 1 },
  '100%': { transform: 'scale(1)' }
})
// ...
<div {...css({
  animation: `${bounce} 2s`,
  width: 50, height: 50,
  backgroundColor: 'red'
})}>
  bounce!
</div>
```

use sparingly! for granular control, use javascript and pencil and paper.

---


## `simulate(...pseudoclasses)`

![hover](http://i.imgur.com/mW7J8kg.gif)

in development, lets you trigger any pseudoclass on an element

---


## `speedy(true/false)`

toggle speedy mode. By default, this is off when `NODE_ENV` is `development`, and on when `production`.


## `flush()`