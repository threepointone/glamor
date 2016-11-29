aphrodite shim
--- 

glamor ships with a aphrodite-like StyleSheet api. 

usage - 
```jsx
import { StyleSheet, css } from 'glamor/aphrodite'

let styles = StyleSheet.create({
  red: { color: 'red' },
  hoverBlue: {
    ':hover': { color: 'blue' }
  }
})

// ...
<div className={css(styles.red, style.hoverBlue)}>
  this is red, and turns blue on hover
</div>  
```


a full example is [available](https://github.com/threepointone/glamor/blob/v3/examples/aphrodite.js).