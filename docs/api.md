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
active      any           checked     _default    disabled    empty
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

`select(selector, props)` / `$(selector, props)`

an escape hatch to define styles for arbitrary css selectors. your selector is appended 
directly to the css rule, letting you define 'whatever' you want. use sparingly!

```jsx
<div {...$(':hover ul li:nth-child(even)', { color: 'red' })}>
  <ul>
    <li>one</li>
    <li>two - red!</li>
    <li>three</li>
  </ul>
</div>
```

(nb1: don't forget to add a leading space for 'child' selectors. eg - `$(' .item', {...})`. 
(nb2: `simulate()` does not work on these selectors yet.)

---


`parent(selector, style)`

an escape hatch to target elements based on it's parent 

```jsx
<div {...parent('.no-js', { backgroundColor: '#ccc' })}> 
  this is gray when js is disabled   
</div>

TODO - pseudo selectors for the same
```
---

`compose(...rules)` / `merge(...rules)`

combine rules, with latter styles taking precedence over previous ones.

```jsx
<div {...
  compose(
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
<div {...media('(min-width: 500px) and (orientation: landscape)', 
            { color: 'blue' }, hover({ color: 'red' }))}>
  resize away
</div>
```

also included are some presets 

`presets.mobile` - `(min-width: 400px)`
`presets.phablet` - `(min-width: 550px)`
`presets.tablet` - `(min-width: 750px)`
`presets.desktop` - `(min-width: 1000px)`
`presets.hd` - `(min-width: 1200px)`

and use as -
```jsx
media(presets.tablet, {...})
```

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

`keyframes(timeline)`

adds animation keyframes into the document, with an optional name.

```jsx
let bounce = keyframes('bounce', { // optional name
  '0%': { transform: 'scale(0.1)', opacity: 0 },
  '60%': { transform: 'scale(1.2)', opacity: 1 },
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

`insertRule(css)`

append a raw css rule to the stylesheet. the ultimate escape hatch.

```jsx
insertRule(`body { margin: 0; }`)
```

---


`cssFor(...rules)`

a helper to extract the css for given rules. useful for debugging, and [webcomponents](https://github.com/threepointone/glamor/issues/16)

```jsx
let red = style({ color: 'red' })
let blue = style({ border: 'blue' })
console.log(cssFor(red, blue))

/* 
[data-css-16y7vsu]{ color:red; } 
[data-css-1el9v42]{ border:blue; } 
*/
```

`attribsFor(...rules)`

another helper for webcomponents, this generates the attributes to be included when constructing an element's html 

```jsx
// continued from above 
console.log(attribsFor(red, blue))
/*
data-css-16y7vsu="" data-css-1el9v42=""
*/
```
