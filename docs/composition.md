# composing / modularity

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
```

## Conditional styles

All the functions exposed by glamor do cleanup of arguments. False, null, undefined and {} values will be removed.

Following invocations produce same css rules:
```jsx
style({ fontSize: '1rem',  color: null }) 
style({ fontSize: '1rem',  color: false }) 
style({ fontSize: '1rem',  color: undefined }) 
style({ fontSize: '1rem' }) 
compose([ { fontSize: '1rem' }, false, undefined, null, {} ])
```

You can use it to build conditional styles this way:

```jsx
// undefined values are ignored
const Component = ({ width, height }) => <div css={{ width, height }} />

<Component width={10} height={10} />
// css: { width: 10, height: 10 }
<Component width={10} />
// css: { width: 20 }
<Component />
// will insert nothing to css

// make use of false values to write conditions
const Component = ({ hidden }) => 
  <div css={{ 
    backgroundColor: 'green', 
    width: 200, 
    height: 100, 
    display: hidden && 'none' 
  }}/>
// or
const Component = ({ hidden }) => 
  <div css={[ 
    { 
      backgroundColor: 'green', 
      width: 200, 
      height: 100 
    }, hidden && { 
      display: 'none' 
    } 
  ] }/>
```  

any other ideas? [share!](https://github.com/threepointone/glamor/edit/master/docs/composition.md)
