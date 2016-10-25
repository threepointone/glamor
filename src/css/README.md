css
---

tl:dr; 
  - you can now write 'real' css in your javascript
  - that just works 
  - with syntax highlighting and linting
  - and can be precompiled / extracted 
  - all glamor goodies apply 

```jsx
let rule = css`
  color: red;
  font-family: helvetica, sans-serif
  :hover: {
    color: blue
  }
  @media(min-width: 300px){
    color: green
  }
`
// ...
<div className={rule}>
  zomg!
</div>
```

longer 

```jsx
let rule = css`
  /* 'real' css syntax */
  color: yellow; 
  
  /* pseudo classes */  
  :hover {
    /* just javascript */
    color: ${ Math.random() > 0.5 ? 'red' : 'blue' };
  }
  
  /* contextual selectors */
  & > h1 { color: purple }  
  html.ie9 & span { padding: 300px }
  
  /* compose with objects */
  ${{ color: 'red' }}
  
  /* or more rules */
  ${ css`color: greenish;` }
  
  /* media queries */
  @media (min-width: 300px) {
    color: orange;
    border: 1px solid blue;
    ${{ color: 'brown' }}
    /* increase specificity */
    && {
      color: blue;
      ${{ color: 'browner' }}
    }
  }
`
```


babel plugin (work in progress)
---

the babel plugin strips out the tagged literal syntax,
and replaces with a glamor friendly json form. everybody wins! this - 
```jsx
css` color: red `
```
becomes this -
```jsx
css({ color: 'red' })
```
eliminating the need for the css parser in the js bundle. wowzah.


todo

- direct selectors `> h1 {...}`
- match more of the css spec (currently ~2.1)
~ babel plugin
- fallback values
- tests!!!
