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

target pseudoclasses
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
<div {...hover({ color: 'red' })} {...simulate()}/>
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

[(more examples)](https://github.com/threepointone/glamor/blob/master/src/ous.js)


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
  <div className="one bold">is blue-bold!</div>
  <div className="two">hover red!</div>
</div>

```

your components could also accept props to be merged into the component 

```jsx
let defaultStyle = { color: 'blue' }
export const Button = ({ css, children, ...props }) => 
  <button {...this.props} {merge(defaultStyle, css)}>
    {this.props.children}
  </button>

<Button css={hover({ color: 'red' })} />
```

also - themes

parent selectors 
---

css

```css
.no-js .something #box { color: gray; }
```

glamor 
```jsx
let box = parent('.no-js .something', 
  { color: 'gray' })

<div {...box} /> 
```


sibling relationship
---


apply media queries
---

```css
.box {
  position: 'relative',
  width: '100%',
  maxWidth: 960,
  margin: '0 auto',
  padding: '0 20px',
  boxSizing: 'border-box'
}

.box:after {
  content: '""',
  display: 'table',
  clear: 'both'
}

@media (min-width: 400px) {
  .box {
    width: 85%;
    padding: 0
  }
}

@media (min-width: 550px) {
  .box:nth-child(2n) {
    width: 80%
  }
}
```


```jsx
const container = merge(
  {
    position: 'relative',
    width: '100%',
    maxWidth: 960,
    margin: '0 auto',
    padding: '0 20px',
    boxSizing: 'border-box'
  },
  after({
    content: '""',
    display: 'table',
    clear: 'both'
  }),
  media('(min-width: 400px)', {
    width: '85%',
    padding: 0
  }),
  media('(min-width: 550px)', nthChild('2n', {
    width: '80%'    
  }))  
)
```


add a global css rule
---

css 

```css
html, body { padding: 0 }
```

glamor 

```jsx
insertRule('html, body { padding: 0 }')
```

fallback values
---

css
```
.box {
  display: flex;
  display: block;
}
```

```jsx
let box = style({
  display: ['flex', 'block']
})
```


fonts
---

animations
---

css reset / normalize
---

```jsx
import `glamor/reset`
```

make a grid 
---


css-vars
---


