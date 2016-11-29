selectors
---
glamor uses objects to represent css rules, where 'sub'-rules can be defined with selectors/@media queries/@supports statements.

glamor supports 2 types of selectors -

- regular selectors like `:hover`, `:nth-child(2)`, `:active span.title`, `> h1`
```jsx
css({
  ':hover': {},
  '> h1': {},
  ' span.title': {} // note the leading space for this child selector  
})
```

- contextual selectors: `&` will be replaced by the 'pointer' to the target rule
```jsx
// these 2 are equivalent 
css({
  ':hover': {}
})
css({
  '&:hover': {}
})
// handy for tricky selectors
css({
  'html.ie9 & span.title': {},
  '&&': {} // increases specificity of itself
})

```

- media queries are defined similarly
```jsx
css({
  color: 'red',
  '@media (min-width: 300px)': {
    color: 'blue'
  }
})
```

- `@supports` statements are predictably similar (note - does not work in IE, UC browsers)
```jsx
css({
  '@supports (display: table-cell)': {
    ...
  }
})

```

Objects can be nested infinitely
```jsx
css({
  ':hover': {
    color: 'blue'
    ':active': {
      color: 'red'
    }
  },
  // media queries / @supports too!
  '@media (min-width: 300px)': {
    color: 'green',
    '@media print': {
      color: 'yellow'
    }
  }
})

// is equivalent to
css({
  ':hover': { color: 'blue' },
  ':hover:active': { color: 'red' },
  '@media (min-width: 300px)': { color: 'green' },
  '@media (min-width: 300px) and print': { color: 'yellow' }
})
```



- rules can be arrays 
```jsx
css({
  color: 'red',
  ':hover': [
    { color: 'blue', fontWeight: 'bold' },
    { textDecoration: 'underline' }
  ]
})
```


- that might not seem like much, but rules can be other rules too, so...
```jsx
let bold = css({ fontWeight: bold })
let rule = css({
  color: 'red',
  '> h1': bold,
  ':hover': [{ color: 'blue' }, bold, ...more]
})
```

This gives us extreme flexibility in defining and combining rules for various situations. 

