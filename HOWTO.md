WARNING : WORK IN PROGRESS
---




// a comparison of techniques for using css&html vs glamor&react 

apply a style to a single element 
--- 

first, with css 

```css
#box {
  color: red;
}
```

```html
<div id='box'> 
  this is a nice box. 
<div>
```

now, with glamor 
```jsx 
<div {...style({ color: 'red' })}>
  this is a nice box. 
</div>
```

notes - glamor automatically generates selectors and reuses common styles, so you can call `style()` cheaply

add pseudo class styling to an element
---

css - 
```css
#box:hover {
  color: blue;
}
```

glamor -

<div {...hover({ color: 'blue' })}></div>

- simulation

apply multiple rules to an element 
---
1. basic inline 
2. compose()


apply styles to child selectors
---
0. classnames
1. select(classes)
2. context-override

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


extend the syntax
---


fallback values
---



