css
---

styled('div')`
  color: red;
  border: 1px solid blue;
  background: url(${props => props.url || 'bg.png'});
  /* comments? */
  &:hover {
    color: red  // inline comments?
  }
  @media query {
    color: ${greenVar}
    &:hover {
      nest: more
    }
  }
  html.someglobal & {
    sall: good;
  }
  &:active ${{
    an: object
  }}
`

// variant with no inline functions
css`
  color: red;
  // etc...
`

todo - plugin
---

a babel plugin that strips out the tagged literal syntax,
and replaces with a json form. everybody wins!
we can do this because we control the ast
and there's a corresponding json representation for every kv pair / nesting form

working
- basic css
- media lists
- inline key values
- contextual selectors
- interpolations

todo
- media queries
- babel plugin
- fallback values
- composes
