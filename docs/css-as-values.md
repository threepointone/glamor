CSS as values
---

Consider the hello world of css 
```css
.error { color: red; font-weight:bold; }
```

This is usually read as 'all elements with class "error" will have bold red text'. Now, we could also read this as 'apply "error" class to the desired element to get bold red text'. This is good; our 'mental model' now has a whole set of rules, somewhat indexed by selector, that we can apply on elements to make them look a particular way. This approach is used heavily, and fairly successfully in plain css frameworks. Consumers use classes like .button, .info, .form-field which behave as an api of sorts for the f/w, and style their elements / components. 

However, this has one problem. Suppose I wanted an element to have bold red text only when hovered on (and possibly add some more properties). What do I do then? 
- I have to edit the selector, which is not possible because it's in a dependency. 
- I have to copy paste the whole rule, which misses the point of the f/w, and would miss out on further changes to .error.
- I have to reimplement :hover with javascript and apply it ahahahahaha please no

This is because CSS complects an element target, state and style into a single rule, and provides no real way to extend previous definitions. The example might seem contrived, but you can see how this would become critical with complex rules, for multiple pseudo states / selectors / media queries / etc. It's particularly grating because in javascript, we merge and compose values all the time with Object.assign, lodash, or even simple loops+assignment. Being unable to take this 'unit' of css and use it to compose further is annoying, isn't modular, leads to bugs, and (insert ThoughtLeader™ rant). 

Anyway. What possible solutions do we have?

- [custom css properties / vars](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables)

```css
:root {
  --error-color: red;
  --error-weight: bold;
}

.x { color: var(--error-color); font-weight: var(--error-weight) }
.y:hover { color: var(--error-color); font-weight: var(--error-weight); font-style: italic }
```
- this allows us to have 'references' and share variables, though it's only available for property values. Further, these can't really be dynamic values, and have to declared in advance.


- the [`@apply rule` spec](https://tabatkins.github.io/specs/css-apply-rule/) 
```css
:root {
  --error: { color: red; font-weight: bold }
}

.x { @apply --error }
.y:hover { @apply --error; font-style: italic }
```
This is great! `@apply` allows custom property sets, which can be further composed. Like regular css, it's not 'dynamic', and you'll have to get consumers to compile to this spec.

- similarly, your favorite css preprocessor might have some form of mixin construct to apply rules(eg - [sass](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#mixins), [less](http://lesscss.org/features/#mixins-feature). These are nice too, but can't be dynamic, but have the mental overhead of having to learn a custom DSL. Speaking of which...

css-in-js has the advantage of being able to leverage javascript, and gives us good alternatives. Some examples - 

- [cxs](https://github.com/jxnblk/cxs)
```jsx
let error = { color: 'red' }
let x = cxs(error)
let y = cxs({ ':hover': { ...error, fontStyle: 'italic' })
```
This is much nicer, and feels more natural in the js world. Values could be dynamic too! But you can't compose previously created rules, and developers have to manually merge styles. This might not be a big deal, and has the advantage of being fairly framework independent (depending on what features you use)

- styled-components 
```jsx
let error = css` color: red; font-weight: bold; `
let X = styled.div`
  ${error}
`
let Y = styled.div`
  :hover {
    ${error};
    font-style: italic;
  }
`
```
This is really nice, and being backed by the postcss parser makes it fairly safe. Depending on your feelings about concatenating strings, SC might be the solution for you. 

- glamor! (because this is clearly self serving)
```jsx
let error = css({ color: 'red' })
let x = error // no need to wrap, just use directly 
let y = css({ ':hover' : [x, { fontWeight: 'bold' }])
```
with glamor, rules are first class values, and can be used at any point in an object. You can even pass arrays of rules at any point to compose them in order, and glamor takes care of nesting and precedence and whatnot. 


css-in-js gives us an opportunity to compose css and styles in ways we haven't been able to before, and in a fluent, accessible manner. I recommend you try it!
