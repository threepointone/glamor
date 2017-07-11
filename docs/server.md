
server side rendering
---

`renderStatic(fn:html)`
`renderStaticOptimized(fn:html)`
`rehydrate(ids)`

this api is mostly copied from [aphrodite](https://github.com/Khan/aphrodite);
render your component inside of a callback, and glamor will gather all
the calls you used and return an object with html, css, and an array of ids
to `rehydrate` the library for fast startup

```jsx
// on the server
import { renderStatic } from 'glamor-server'
let { html, css, ids } = renderStatic(() =>
  ReactDOMServer.renderToString(<App/>)) // or `renderToStaticMarkup`
```
```html
<!-- when rendering your html -->
<html>
  <head>
    <style dangerouslySetInnerHTML={{ __html: css }} />
    <!-- alternately, you'd save the css to a file
      and include it here with
    <link rel='stylesheet' href='path/to/css'/>
     -->
  </head>
  <body>
    <div id='root'>${html}</div>
    <script>
      // optional!
      window._glam = ${JSON.stringify(ids)}
    </script>
    <script src="bundle.js"></script>
  </body>
</html>
```
```jsx
// optional!
// when starting up your app
import { rehydrate } from 'glamor'
rehydrate(window._glam)
ReactDOM.render(<App/>, document.getElementById('root'))
```

- if using `rehydrate`, it HAS to execute before you run any code that defines any styles. [This can get tricky with es6 imports.](https://github.com/threepointone/glamor/issues/37#issuecomment-257831193)

caveat: the above will include all the css that's been generated in the app's lifetime.
This should be fine in most cases. If you seem to be including too many unused styles,
use `renderStaticOptimized` instead of `renderStatic`. This will parse the generated
html and include only the relevant used css / ids.

WARNING: if you're bundling your *server side* code with webpack/browserify/etc (as opposed to just browser code), be warned of a subtle issue with excluding node_modules from the module. More details in [this twitter thread](https://twitter.com/andrewingram/status/771370174587043840), and [this issue](https://github.com/threepointone/glamor/issues/37). tldr - be certain to exclude *all* glamor modules, not just the root.


(experimental) inlining
---

```jsx
inline(html)
```

to take advantage of streaming rendering, we could also inline the css directly into the html. 
```jsx
// on the server
import { inline } from 'glamor-server'
import { renderToString } from 'react-dom/server'
let html = inline(renderToString(<App/>)) 
// ... that's it!
```

pros 
--- 

- progressively load just the precise css you need, precisely when you need it
- based on ideas [in this post](https://jakearchibald.com/2016/link-in-body/)
- doesn't break react checksums
- great for statically rendered sites 

cons
---

- hyper optimization 
- unclear runtime characteristics
