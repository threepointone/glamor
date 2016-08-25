
server side rendering
---

`renderStatic(fn:html)`
`renderStaticOptimized(fn:html)`
`rehydrate(cache)`

this api is mostly copied from [aphrodite](https://github.com/Khan/aphrodite);
render your component inside of a callback, and glamor will gather all
the calls you used and return an object with html, css, and an object
to rehydrate the lib's cache for fast startup

```jsx
// on the server
import { renderStatic } from 'glamor/server'
let { html, css, cache } = renderStatic(() =>
  ReactDOMServer.renderToString(<App/>)) // or `renderToStaticMarkup`
```
```html
<!-- when rendering your html -->
<html>
  <head>
    <style>${css}</style>
    <!-- alternately, you'd save the css to a file
      and include it here with
    <link rel='stylesheet' href='path/to/css'/>
     -->
  </head>
  <body>
    <div id='root'>${html}</div>
    <script>
      // optional!
      window._css = ${JSON.stringify(cache)}
    </script>
    <script src="bundle.js"></script>
  </body>
</html>
```
```jsx
// optional!
// when starting up your app
import { rehydrate } from 'glamor'
rehydrate(window._css)
ReactDOM.render(<App/>, document.getElementById('root'))
```

caveat: the above will include all the css that's been generated in the app's lifetime.
This should be fine in most cases. If you seem to be including too many unused styles,
use `renderStaticOptimized` instead of `renderStatic`. This will parse the generated
html and include only the relevant used css / cache.
