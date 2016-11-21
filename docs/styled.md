styled-components
---

[experimental, buggy]

an implementation of the styled-components API with glamor 

To use, add 'glamor/babel' to the `plugins` field in your babel config. 

```jsx
import { styled } from 'glamor/styled'

const Button = styled.button`  
  background: ${props => props.primary ? 'palevioletred' : 'white'};  /* Adapt the colors based on primary prop */
  color: ${props => props.primary ? 'white' : 'palevioletred'};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`

```

pros
---

- all glamor goodies apply; SSR, composition, etc 
- the babel plugin precompiles the code to glamor objects


cons 
--- 
- parser doesn't match all of the css spec (currently about ~2.1)
- just one level of nesting, like glamor 
- interpolations *may* fail for unaccounted patterns. open an issue if you find one. 

todo 
---

- react-native
- `<ThemeProvider />`