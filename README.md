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
We introduce an api to annotate arbitrary dom nodes with style definitions ("rules"),
processing/optimizing behind the scenes with the
[CSSStyleSheet](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet)
api for, um, the greater good.

features
---

- fairly small / efficient, with a fluent api
- framework independent
- adds vendor prefixes
- supports all the pseudo classes/elements
- supports media queries
- dev helper to simulate pseudo classes like `:hover`, etc
- server side rendering
- tests / coverage


cons
---

- no pretty class/attribute names
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
  <a {...style({ color: 'blue' })} href='github.com'>
    click me
  </a>
</div>
```

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



composing / modularity
---

while it's tempting to add some form of a `Stylesheet` construct, we'd
rather defer to the developer's preference. In general, we recommed using
simple objects, functions, and components to create abstractions. You can
also lean on `merge(...styles)` for combining rules.

[todo - examples]


server side rendering
---

`renderStatic(fn:html)`
`renderStaticOptimized(fn:html)`
`rehydrate(cache)`

this api is mostly copied from [aphrodite](https://github.com/Khan/aphrodite);
render your component inside of a callback, and react-css will gather all
the calls you used and return an object with html, css, and an object
to rehydrate the lib's cache

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

compared to aphrodite / other css-in-js systems
---

- shares most of the common features across those libs
  - server side rendering : react-css can generate minimal css for given html, and
  then bootstrap itself on the browser for fast startup.
  - pseudo classes / elements : react-css supports all of them, with a consistent api.
  - media queries : react-css supports these too, and combines well with the above.
  - framework independent : as long as you can add attributes to dom nodes, you're good to go
  - adding appropriate vendor specific prefixes to relevant css properties
  - handles precedence order with (`merge(...styles)`)
  - (todo) automatic global `@font-face` detection and insertion
  - (todo) handle precedence order

- doesn't touch class/style attributes ([some implications](https://github.com/Khan/aphrodite/issues/25))

- doesn't generate pretty classnames

- styles are defined as 'rules', not 'stylesheets', and then indexed behind the scenes by
  hashing themselves on `data-*` attributes. This lets you define styles 'inline' with elements
  in a functional / reacty manner, yet globally optimize them as one unit. As such, a lot of the cruft around
  classNames/stylesheets just goes away.

- react-css comes with a `simulate()` dev helper to 'trigger' pseudo classes on
specific elements. combined with hot-loading, the dx while editing styles is pretty nice.

- (todo) styles couldfurther be statically analyzed and replaced with said data attributes,
  generating a much more optimal css file / js bundle ([#2](https://github.com/threepointone/react-css/issues/2))


todo
---

- font face detection / on-demand loading
- animation / keyframe / transform generation
- error checking / typechecks (flow? runtime?)
- compile time optimizations / statically generate css files alá jsxstyle
- other frameworks?
- non-dom? (!)
- plugins
- flush unused rules?
- multiple psudo classes on same rule
- benchmarks (#3)
- investigate batching stylesheet changes
- theming et al


profit, profit
---

I get it
