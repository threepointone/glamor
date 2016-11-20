// css vs glamor

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
import {style} from 'glamor'

let box = style({ color: 'red' })
// ...
<div {...box}>
  this is a nice box. 
</div>

// or 
<div className={box}>
  this is a nice box. 
</div>


```

pseudoclasses
---

css
```css
.box:hover { color: blue; }
```

glamor
```jsx
import {hover, style} from 'glamor'

let boxHover = hover({ color: 'blue' })
// or 
let boxHover = style({ 
  ':hover': {
    color: 'blue' 
  } 
})
```


multiple styles to an element
---

css
```html
<div class="bold myClass"/>
```

glamor 
```jsx
import {merge} from 'glamor'

<div {...bold} {...myClass} />

// or, unlike css, to maintain precendence order 

<div {...merge(bold, myClass)} />

// also works with classes

<div className={merge(bold, myClass)} />
```

[(more examples for composing rules)](https://github.com/threepointone/glamor/blob/master/src/ous.js)


child selectors
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
import {merge, select as $} from 'glamor'

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

[todo - vars and themes]

parent selectors 
---

css
```css
.no-js .something #box { color: gray; }
```

glamor 
```jsx
import {parent} from 'glamor'

let box = parent('.no-js .something', 
  { color: 'gray' })

<div {...box} /> 
```


siblings
---

use `+` and `~` selectors

css
```css
.list li:first-of-type + li {
  color: red
}
```
```html
<ul class='list'>
  <li>one</li>
  <li>two - red!</li>
  <li>three</li>
</ul>
```

glamor
```jsx
import {select as $} from 'glamor'

let ul = $(' li:first-of-type + li', {
  color: 'red'
})

// ...

<ul {...ul}>
  <li>one</li>
  <li>two - red!</li>
  <li>three</li>  
</ul>

```


media queries
---

css
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

glamor
```jsx
import {merge, after, media, nthChild} from 'glamor'

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


:global css rule
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
```css
.box {
  display: flex;
  display: block;
}
```

glamor 
```jsx
let box = style({
  display: ['flex', 'block']
})
```


font-face
---

[todo]

animations
---

css 
```css
@keyframes bounce { 
  0%': { transform: scale(0.1); opacity: 0; }
  60%: { transform: scale(1.2), opacity: 1 }
  100%: { transform: scale(1) }
}
.box {
  animation: bounce 2s;
  width: 50, height: 50,
  backgroundColor: 'red'
}
```

glamor
```jsx
let bounce = keyframes({ 
  '0%': { transform: 'scale(0.1)', opacity: 0 },
  '60%': { transform: 'scale(1.2)', opacity: 1 },
  '100%': { transform: 'scale(1)' }
})

let box = style({
  animation: `${bounce} 2s`,
  width: 50, height: 50,
  backgroundColor: 'red'
}) 
```

css reset / normalize
---

```jsx
import `glamor/reset`
```

grids
---

[todo]



