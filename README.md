# threepointone/react-css

[work in progress, feedback appreciated]

css for component systems

`npm install @threepointone/react-css --save`

```jsx
<div {...style({ color: 'red' })} {...hover({ color: 'pink' })}>
  zomg
</div>
```

motivation
---

This expands on ideas from @vjeux's [2014 css-in-js talk](https://speakerdeck.com/vjeux/react-css-in-js).
We introduce an api to annotate arbitrary dom nodes with style definitions ("rules") for, um, the greater good.

features
---

- fairly small / efficient, with a fluent api
- framework independent
- adds vendor prefixes
- supports all the pseudo :classes/::elements
- supports `@media` queries
- supports `@font-face` and `@keyframes`
- dev helper to simulate pseudo classes like `:hover`, etc
- server side rendering
- tests / coverage


cons
---

- no real-world usage / adoption yet
- changes across large ranges of values could cause a memory leak ([#1](https://github.com/threepointone/react-css/issues/1))

api
---

`style(props)`

defines a `rule` with the given key-value pairs. returns an object (of shape `{'data-css-<id>': ''}`),
to be added to an element's attributes. This is *not* the same as element's `style`,
and doesn't interfere with the element's `className` / `class`

```jsx
<div {...style({ backgroundColor: '#ccc', borderRadius: 10 })}>
  <a {...style({ label: 'blueText', color: 'blue' })} href='github.com'>
    click me
  </a>
</div>
```

protip - in dev mode, adding a `label` string prop will reflect its value in devtools.
useful when debugging, and a good alternative to 'semantic' classnames.

---

`<pseudo>(props)`

where `<pseudo>` is one of :
```
active      any           checked     default     disabled    empty
enabled     first         firstChild  firstOfType fullscreen  focus
hover       indeterminate inRange     invalid     lastChild   lastOfType
left        link          onlyChild   onlyOfType  optional    outOfRange
readOnly    readWrite     required    right root  scope       target
valid       visited
```

defines a `rule` for the given pseudoclass selector

```jsx
<div {...hover({ backgroundColor: '#ccc', display: 'block'})}>
  <input
    {...style({ color: 'gray', fontSize: 12 })}
    {...focus({ color: 'black' })}
    {...hover({ fontSize: 16 })} />
</div>
```

---

`<pseudo>(param, props)`

where `<pseudo>` is one of :
```
dir  lang  not  nthChild  nthLastChild  nthLastOfType  nthOfType
```

like the above, but parameterized with a number / string

```jsx
dir('ltr', props), dir('rtl', props)
lang('en', props), lang('fr', props), lang('hi', props) /* etc... */
not(/* selector */, props)
nthChild(2, props), nthChild('3n-1', props), nthChild('even', props) /* etc... */
nthLastChild(/* expression */, props)
nthLastOfType(/* expression */, props)
nthOfType(/* expression */, props)
```

---

`<pseudo>(props)`

where `<pseudo>` is one of
```
after  before  firstLetter  firstLine  selection  backdrop  placeholder
```

similar to the above, but for pseudo elements.

```jsx
<div {...before({ content: '"hello "' })}>
  world!
</div>
// note the quotes for `content`'s value
```

---

`multi(pse:udos, props)`

pass a `:`-separated list of  pseudoclasses; for when you need to add
multiple pseudoclasses to a rule.

```jsx
multi('hover:active', { color: 'red' })
// corresponds to [data-css-1cb101e]:hover:active { color: red; }
```

---

`select(selector, props)`

an escape hatch to define styles on children. use sparingly!

```jsx
<div {...select('ul li:nth-child(even)', { color: 'red' })}>
  <ul>
    <li>one</li>
    <li>two - red!</li>
    <li>three</li>
  </ul>
</div>

```

---

`merge(...rules)`

combine rules, with latter styles taking precedence over previous ones.

```jsx
<div {...merge(
    style(props),
    hover(props),
    { color: 'red' },
    hover(props)) }>
    mix it up!
</div>
```

---

`media(query, ...rules)`

media queries!

```jsx
<div {...media('(min-width: 500px) and (orientation: landscape)', hover({ color: 'red' }))}>
  resize away
</div>
```

caveat: you cannot merge `media()` rules yet, but I think that makes sense.
Instead, merge your rules before calling `media()`. For any complex logic
around viewport attributes, use javascript.

---

`simulate(...pseudoclasses)`

![hover](http://i.imgur.com/mW7J8kg.gif)

in development, lets you trigger any pseudoclass on an element

---

`fontFace(font)`

loads the given font-face at most once into the document, returns the font family name

```jsx
let family = fontFace({
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

`animation(keyframes)`

adds animation keyframes into the document, with an optional name.

```jsx
let bounce = animation('bounce', { // optional name
  '0%': { transform: 'scale(0.1)', opacity: 0 }
  '60%': { transform: 'scale(1.2)', opacity: 1 }
  '100%': { transform: 'scale(1)' }
})
// ...
<div {...style({
  animation: `${bounce} 2s`,
  width: 50, height: 50,
  backgroundColor: 'red'
})}>
  bounce!
</div>
```

use sparingly! for granular control, use javascript and pencil and paper.

---

composing / modularity
---

while it's tempting to add some form of a `Stylesheet` construct, we'd
rather defer to the developer's preference. In general, we recommed using
simple objects, functions, and components to create abstractions. You can
also lean on `merge(...styles)` for combining rules. Some examples -

```jsx
// name your rules with vars/consts/whatevs
let container = style({ color: THEME.primary }),
  item = merge({ backgroundColor: '#ccc' }, hover({ backgroundColor: 'white' })),
  selected = style({ fontWeight: 'bold' })
}
// ...and when rendering
<div {...container}>
  <ul>
    <li {...item}> one </li>
    <li {...item} {...selected}> two </li>
    <li {...item}> three </li>
  </ul>
</div>


// encapsulate custom behavior/attributes with components / functions
let types = {
  'primary': 'blue',
  'secondary': 'gray',
  'disabled': ''
}

let Button = ({ type, children, onClick = ::console.log }) =>
  <button {...style({ backgroundColor: types[type] })}
    onClick={onClick}>
      {children}
  </button>

// and when rendering ...
  <div>
    are you ready?
    <Button type='primary'>click me!</Button>
  </div>

// or make your own helper function alá aphrodite et al
let sheet = createSheet({
  container: {...},
  item: {
    ...,
    ':hover': {
      ...
    }
  }
})

// and when rendering
<div {...sheet.container}>
  ...etc...
</div>

// any other ideas? share!
```

server side rendering
---

`renderStatic(fn:html)`
`renderStaticOptimized(fn:html)`
`rehydrate(cache)`

this api is mostly copied from [aphrodite](https://github.com/Khan/aphrodite);
render your component inside of a callback, and react-css will gather all
the calls you used and return an object with html, css, and an object
to rehydrate the lib's cache for fast startup

```jsx
// on the server
import { renderStatic } from '@threepointone/react-css'
let { html, css, cache } = renderStatic(() =>
  ReactDOMServer.renderToString(<App/>)) // or `renderToStaticMarkup`
```
```html
<!-- when rendering your html -->
<html>
  <head>
    <style>${css}</style>
    <!-- alternately, you'd save the css to a file
      and include it here with
    <link rel='stylesheet' href='path/to/css'/>
     -->
  </head>
  <body>
    <div id='root'>${html}</div>
    <script>
      // optional!
      window._css = ${JSON.stringify(cache)}
    </script>
    <script src="bundle.js"></script>
  </body>
</html>
```
```jsx
// optional!
// when starting up your app
import { rehydrate } from '@threepointone/react-css'
rehydrate(window._css)
ReactDOM.render(<App/>, document.getElementById('root'))
```

caveat: the above will include all the css that's been generated in the app's lifetime.
This should be fine in most cases. If you seem to be including too many unused styles,
use `renderStaticOptimized` instead of `renderStatic`. This will parse the generated
html and include only the relevant used css / cache.

characteristics
---

while react-css shares most common attributes of other inline style / css-in-js systems,
here are some key differences -

- in dev mode, you can simulate pseudo classes on elements by using the `simulate()` helper (or adding a `[data-simulate-<pseudo>]` attribute manually). very useful, especially when combined when hot-loading and/or editing directly in your browser devtools.
- rules are hashed and indexed based on their styles; we then use a stylesheet as a key-value store to insert/remove individual rules + additional meta for `simulate`.
- as such, it does **not** generate pretty classnames, but instead generates debug labels in dev mode, clearly showing merges, pseudos, and media queries. This keeps the generated html small, but still good dx. (issue [#5](https://github.com/threepointone/react-css/issues/5))
- does **not** touch `class`/`style` attributes; instead we use `data-*` attributes and jsx attribute spread for a natural, fluent api ([some implications](https://github.com/Khan/aphrodite/issues/25)). This lets you define styles 'inline' in a functional / reacty manner, yet globally optimize as one unit.
- this also keeps it framework-independent (though I still have to see how to use this in angular/ember templates. see - [#6](https://github.com/threepointone/react-css/issues/6))
- (todo) opportunities for static optimizations ([#2](https://github.com/threepointone/react-css/issues/2))

todo
---

- error checking / typechecks (flow? runtime?)
- plugins
- other frameworks?
- refactor the hairball
- non-dom? (!)
- flush unused rules?
- compile time optimizations / statically generate css files alá jsxstyle
- benchmarks ([#3](https://github.com/threepointone/react-css/issues/3))
- investigate batching stylesheet changes
- theming et al
- fix autoprefixer order bugs
- bring back coverage

profit, profit
---

I get it
