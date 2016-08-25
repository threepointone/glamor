composing / modularity
---

while it's tempting to add some form of a `Stylesheet` construct, we'd
rather defer to the developer's preference. In general, we recommed using
simple objects, functions, and components to create abstractions. You can
also lean on `compose(...styles)` for combining rules. Some examples -

```jsx
// name your rules with vars/consts/whatevs
let container = style({ color: THEME.primary }),
  item = compose({ backgroundColor: '#ccc' }, hover({ backgroundColor: 'white' })),
  selected = style({ fontWeight: 'bold' })
}
// ...and when rendering
<div {...container}>
  <ul>
    <li {...item}> one </li>
    <li {...item} {...selected}> two </li>
    <li {...item}> three </li>
  </ul>
</div>


// encapsulate custom behavior/attributes with components / functions
let types = {
  'primary': 'blue',
  'secondary': 'gray',
  'disabled': 'transparent'
}

let Button = ({ type, children, onClick = ::console.log }) =>
  <button {...style({ backgroundColor: types[type] })}
    onClick={onClick}>
      {children}
  </button>

// and when rendering ...
  <div>
    are you ready?
    <Button type='primary'>click me!</Button>
  </div>

// or make your own helper function alá aphrodite et al
let sheet = createSheet({
  container: {...},
  item: {
    ...,
    ':hover': {
      ...
    }
  }
})

// and when rendering
<div {...sheet.container}>
  ...etc...
</div>

// any other ideas? share!
```
