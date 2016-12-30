[work in progress]

what hapens when I call `css(...rules)`?
---

`->` denotes possible return points

In order - 

- check weakmap cache `->`
- recursively normalize / flatten / merge 
- hashify
- check hash cache `->`
- check insertion cache `->`
- split into css rule objects 
- apply plugins (vendor prefixing, etc)
- generate css
- insert into stylesheet
- create rule 
- update hash, insertion, weakmap caches
- `->`

weakmap cache
---

[as detailed here](https://github.com/threepointone/glamor/blob/master/docs/weakmaps.md)

normalization 
---

we accept different types of inputs - objects, arrays, other rules, and nested variations thereof, allowing them to be composed as the developer pleases. Internally though, it makes sense to 'flatten' them down, making it simpler to merge values and whatnot. This also has the advantage of being able to dedupe paths, and compose complicated selectors split out in different objects. For example - 

[todo] 

hashify
---

the big idea here - 2 separate calls to `css({color: 'red'})` should refer to the same css rule. So unlike 'real' css where one has to decide the name of the class in advance, we let our computers figure out a unique classname for the given input. The simplest way (I think), is to generate a hash (I use murmur2) for the given input, and save the generated rule against it; so any time we use an input that maches the hash, we can return the cached rule instead.

insertion cache 
---

This cache simply checks whether a rule with a given id/hash has been inserted into the stylesheet yet. You might be wondering why we have both the hash and insertion caches. This comes into play when interacting with SSR prerendered css. We want to be able to populate the hash caches etc, yet skip inserting the css for rules that have already been rehydrated. So... yeah, this is why. Simple :) 

plugins
---

[as detailed here](https://github.com/threepointone/glamor/blob/master/docs/plugins.md)

generate css
---

This is as straightforward as you'd imagine. The normalized style is broken into different bits, corresponding to individual css rules. Of note, We use a vendored version of React's `CSSPropertyOperations` to convert the object into a css string. 

insert into stylesheet 
---

[todo - stylesheet.md]

create rule 
---

Finally, we create an object to return. It has the shape - 
```jsx
{
  'data-css-<hash>': 'possible label',
  toString = () => 'css-<hash>' // marked non-enumerable 
}
```

All 3 caches get updated with this rule. It's a funny looking thing, but has the advantage of being able to be spread on the props of an element, or coerced into a string to be used a classname. For the curious, it's actually 'expensive' to create this object, since it creates a new Hidden Class in the JS VM for each rule because they all have unique keys. Bet you're happy we use the caches now, huh? :)