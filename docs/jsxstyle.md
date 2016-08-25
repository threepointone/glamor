jsxstyle shim
---

This is a clone of [jsxstyle](https://github.com/petehunt/jsxstyle/)

usage - 

`View`

```jsx
import { View } from 'glamor/jsxstyle'

// ...

<View 
  color='red'   // regular style properties 
  backgroundColor='#ccc'
  css={{ outline: '1px solid black' }} // or a style object
  hover={{ color: 'blue' }} // pseudo classes
  select={[' li:nth-child(3)', { textDecoration: 'underline' }]} // arbitrary selectors
  media={[ '(min-width: 400px)', {
    width: '85%',
    padding: 0
  } ]} // media queries
  compose={[...]}  // add as many more rules 
  component='ul' // use any tag/component
  style={{ border: '1px solid green' }} // 'inline' style  
  className='mylist' // combine with aphrodite/css modules/etc 
  onClick={() => alert('what what!')} // event handlers
  props={{ disabled: true }} // pass props to the underlying element
>
  <li>one</li>
  <li>two</li>
  <li>three</li>
  <li>four</li>
</View>

// also available - Block, InlineBlock, Flex, Row, Column

```
