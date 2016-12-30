[work in progress]

what hapens when I call `css(...rules)`?
---

`->` denotes possible return points

In order - 

- check weakmap caches `->`
- recursively normalize / flatten / merge 
- hashify
- check hash caches `->`
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

the big idea here - 2 separate calls to css({color: 'red'}) should refer to the same css rule. So unlike 'real' css where one has to decide the name of the class in advance, we let our computers figure out a unique classname for the given input. The simplest way (I think), is to generate a hash (I use murmur2) for the given input, and save the generated rule against it; so any time we use an input that maches the hash, we can return the cached rule instead.

insertion cache 
---

This cache simply checks whether a rule with a given id/hash has been inserted into the stylesheet yet. you might be wondering why we have both the hash and insertion caches. This comes into play when interacting with SSR prerendered css. When rehyrating styles, we want to indicate to glamor which rules have already been inserted, to avoid inserting them again. However, we don't know / can't replace `css()` calls in the source code with just the plain rule, especially in cases with dynamic styles, themes, etc. Thus we need those bits to still 'run' to populate the hash caches. 

plugins
---

[as detailed here](https://github.com/threepointone/glamor/blob/master/docs/plugins.md)

generate css
---

[todo]

insert into stylesheet 
---

[todo - stylesheet.md]

create rule 
---

[todo]