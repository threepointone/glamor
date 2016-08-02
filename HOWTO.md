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
<div {...style({ color: 'red' })}></div>
```

