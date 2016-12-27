multi-index caches with WeakMaps
---

### a quick summary of caching in javascript 

- Regular caches are associated with _values_. Stuff like http caches compare the _values_ of requests before deciding whether to 'return' the cached response or not. 
- For simple cases, we would convert this value to a string of some form, and use this string as a key on a js object to memoize some value. Similar to how one would memoize a factorial function, for example. 
- The drawback here is that not every object is serializable to a string, especially when we have to deal with the _identity_ of an object, instead of its value. Further, we can only rarely tell when to evict a value, usually flushing the cache periodically instead. 
- Maps give us a way to associate an object with the _identity_ of an object; we can use the object itself as a key on the map. This is great; for example, we'd use this to associate metadata with objects like dom elements, without writing over the properties of the element itself. 
- However, when used as a cache, we face the drawback that keys have to be manually evicted, else they stick around in memory causing a leak it it's not flushed out regularly (eventually leading you to reimplement GC for the Map. ugh.) 
- WeakMaps are awesome for caches that associated with _identity_ of objects; they hold _weak_ references to their keys, meaning that when 'nothing' is referring to them anymore, they go poof and disappear, cleaned up with regular GC. This means you don't have to manually evict a key; eg - when using a WeakMap with the previous example, when the dom element is destroyed, the meta data associated with it would disappear too 
- It has the drawback that the keys on the WeakMap cannot be enumerated (ie - you can't look inside the WeakMap to tell what it's holding at that moment). You also can't use strings or numbers as keys. 

Ok? ok. 

### So, what does a cache built with a WeakMap look like?

```jsx
// this takes a function as input, and returns another 
// function that applies caching on its input

function cachify(fn){
  let cache = new WeakMap()
  return (arg) => {
    if(cache.has(arg)){
      return cache.get(arg)
    }
    let value = fn(arg)
    cache.set(arg, value)
    return value
  }
}

let cachedFn = cachify(expensiveFn)
cachedFn(x); 
cachedFn(x); // cache hit!
```

### So, how can we use it with glamor? 

Consider the core function, `css(...rules)`

- `rules` can be objects, or arrays, or other rules, but we can be sure that at a given callsite, it'll usually have a stable number of arguments, usually the same 
- rules are cached against their values, so we can guarantee 2 different rules with the same value will have the same identity
- one thing we could also do, is use predefined objects with `css()` instead of defining fresh objects every time it's called. This way, we would pick up on the identity of the object passed in, and return a cached version if available
    
  ```jsx 
  // instead of -

  <div className={css({ color: 'red' })} />

  // we would do

  let red = { color: 'red' }
  // ...
  <div className={css(styles.red)} />

  // or even 
  let red = css({ color: 'red' })
  // ...
  <div className={red} />  
  ```
- indeed, we could write a babel plugin (TODO) that recognizes `css()` calls with 'static' objects, and hoist those objects up to the highest scope possible. DX!!!

### What about multiple arguments?

[ todo - implementation of non-commutative multiple argument cache with WeakMaps ] 

### This sounds great! Any caveats?

- this isn't useful in pathological cases, when you're defining many tens of thousands of _unique_ rules in your css. So unless you're a tumblr/blogspot rendering every site on the same server, you should be good
- we only maintain these caches for 1, 2 and 3 argument inputs. This means that the behavior isn't very explicit, and *might* lead to strange perf characteristics with more arguments passed in a single `css()` call. buyer beware!



