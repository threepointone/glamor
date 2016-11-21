css
---

[experimental, buggy]

tl:dr; 
  - you can now write 'real' css in your javascript
  - with syntax highlighting and linting
  - that gets precompiled / extracted 
  - glamor goodies apply 

To use, add 'glamor/babel' to the `plugins` field in your babel config. 

```jsx
import { css } from 'glamor'


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
  color: yellow; /* 'real' css syntax */
  
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
  ${ css`color: greenish` }
  
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

syntax highlighting 
---
- atom - via [language-babel](https://github.com/styled-components/styled-components#syntax-highlighting)
- sublime text - [open PR](https://github.com/babel/babel-sublime/pull/289)

linting
---
via [stylelint-processor-styled-components](https://github.com/styled-components/stylelint-processor-styled-components)


babel plugin
---

The babel plugin replaces the inline css with glamor friendly json. Everybody wins! This - 
```jsx
css` color: red `
```
becomes this -
```jsx
css({ color: 'red' })
```
eliminating the need for the css parser in the js bundle. wowzah.



todo
---

- move to [rework](https://github.com/reworkcss/css)/anything else for parsing 
- direct selectors `> h1 {...}`
- global css
- override pragma
- match more of the css spec (currently ~2.1)
- fallback values
- in-editor linting
- more interpolation points
- better parsing errors
- tests!!!
- guidance for difference types of 'static' css extraction