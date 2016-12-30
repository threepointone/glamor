[work in progress]

what happens when I call `css(...rules)`?
---

`->` denotes possible return points

Phases, in order - 

- check weakmap cache `->`
- recursively normalize / flatten / merge 
- hashify
- check hash cache `->`
- check insertion cache 
  - split into css rule objects 
  - apply plugins (vendor prefixing, etc)
  - generate css
  - insert into stylesheet, update insertion cache 
- create rule 
- update hash, weakmap caches
- `->`

weakmap cache
---

As a first line of defense, we check to see whether the inputs have been used before to generate rules, and return cached instances if available, [as detailed here.](https://github.com/threepointone/glamor/blob/master/docs/weakmaps.md)

normalization 
---

we accept different types of inputs - objects, arrays, other rules, and nested variations thereof, allowing them to be composed as the developer pleases. Internally though, it makes sense to 'flatten' them down, making it simpler to merge values and whatnot. This also has the advantage of being able to dedupe paths, and compose complicated selectors split out in different objects. [todo- more details on the algorithm?]


hashify
---

the big idea here - 2 separate calls to `css({color: 'red'})` should refer to the same css rule. So unlike 'real' css where one has to decide the name of the class in advance, we let our computers figure out a unique classname for the given input. The simplest way (I think), is to generate a hash (I use murmur2) for the given input, and save the generated rule against it; so any time we use an input that maches the hash, we can return the cached rule instead.

insertion cache 
---

This cache simply checks whether a rule with a given id/hash has been inserted into the stylesheet yet. You might be wondering why we have both the hash and insertion caches. This comes into play when interacting with SSR prerendered css. We want to be able to populate the hash caches etc, yet skip inserting the css for rules that have already been rehydrated. So... yeah, this is why. Simple :) 

plugins
---

The normalized style is broken into different bits, corresponding to individual css rules, then passed and transformed through the plugin chain [as detailed here.](https://github.com/threepointone/glamor/blob/master/docs/plugins.md) These include support for array fallbacks and vendor prefixes by default.

generate css
---

This is as straightforward as you'd imagine. The different different bits from the previous phase are converted into css. Of note, we use a vendored version of React's `CSSPropertyOperations` to convert the object into a css string. 

insert into stylesheet 
---

We use our own abstraction over the browser's stylesheet to insert the rule into the dom. This abstraction also works on node, letting us do stuff like SSR, etc. It also uses different modes of inserting styles based on the environment, 
[as detailed here](https://github.com/threepointone/glamor/blob/master/docs/stylesheet.md)

create rule 
---

Finally, we create an object to return. It has the shape - 
```jsx
{
  'data-css-<hash>': 'possible label',
  toString: () => 'css-<hash>' // marked non-enumerable 
}
```

It's a funny looking thing, but has the advantage of being able to be spread on the props of an element, or coerced into a string to be used a classname. For the curious, it's actually 'expensive' to create this object, causing a deoptimization because they all have unique keys. Bet you're happy we use the caches now, huh? :)


Further possible enhancements 
---

- I'm unhappy with the placement of the plugins phase; indeed, I want something more powerful, being able to tap into any of the phases. 
- because of some of the implicit 'global singletons' here (the stylesheet class, caches, etc), it's harder to provide support for iframes and web component. 
- while we still need proper objects to be returned to be able to take advantage of the weak map caches, etc, we could make it faster by avoiding the `data-css-<hash>` key for environments where developers only use the rule has classnames. Seems like a premature optimization though, and you'd be better off following the [performance guidelines](https://github.com/threepointone/glamor/blob/master/docs/performance.md)