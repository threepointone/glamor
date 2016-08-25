WARNING : WORK IN PROGRESS
---

// a comparison of techniques for using css&html vs glamor&react 

apply a style to an element 
--- 

css

```css
.box { color: red; }
```
```html
<div class='box'> 
  this is a nice box. 
<div>
```

glamor 

```jsx 
let box = style({ color: 'red' })
// ...
<div {...box}>
  this is a nice box. 
</div>
// or, with the `createElement` shim 
<div css={box}>
  this is a nice box. 
</div>
```

add pseudo class styling to an element
---

css

```css
.box:hover { color: blue; }
```

glamor

```jsx
let boxHover = hover({ color: 'blue' })
```

simulate pseduoclasses on elements
---

devtools

glamor 
```jsx
<div {...hover({ color: 'red' })} {...simulate()}
```


apply multiple rules to an element
---

css

```html
<div class="bold myClass"/>
```

glamor 

```jsx
<div {...bold} {...myClass} />

// or, unlike css, to maintain precendence order 

<div {...merge(bold, myClass)} />

// the css prop accepts arrays by default

<div css={[ bold, myClass ]} />

```


more examples in [glamor/ous](https://github.com/threepointone/glamor/blob/master/src/ous.js)

composing rules 
---



apply styles to child selectors
---

css

```css
#box { display: block; }
.bold { font-weight: bold; }
.one  { color: blue; }
#box:hover .two { color: red; }
```
```html
<div id="box">
  <div class="one bold">is blue-bold!</div>
  <div class="two">hover red!</div>
</div>
```

glamor 

```jsx
let box = merge(
  { display: 'block' },
  $(' .bold', { fontWeight: 'bold' }),
  $(' .one', { color: 'blue' }),
  $(':hover .two', { color: 'red' }),  
)

// ...

<div {...box}>
  <div class="one bold">is blue-bold!</div>
  <div class="two">hover red!</div>
</div>

```

also - themes

parent selectors 
---

css

```css
.no-js #box { color: gray; }
```

glamor 
```jsx
let box = parent('.no-js', 
  { color: 'gray' })

<div {...box} /> 
```


sibling relationship
---


apply media queries
---

- presets 
- merges 

fonts
---

animations
---

add a global css rule
---

add a css reset
---

server side / static rendering
---

make a grid 
---

css-vars
---


extend the syntax / plugins
---


fallback values
---



