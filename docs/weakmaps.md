multi-index caches with WeakMaps
---

### a quick summary of caching in javascript 

- Regular caches are associated with _values_. Stuff like http caches compare the _values_ of requests before deciding whether to 'return' the cached response or not. 
- For simple cases, we would convert this value to a string of some form, and use this string as a key on a js object to memoize some value. Similar to how one would memoize a factorial function, for example. 
- The drawback here is that not every object is serializable to a string, especially when we have to deal with the _identity_ of an object, instead of its value. Further, we can only rarely tell when to evict a value, usually flushing the cache periodically instead. 
- Maps give us a way to associate an object with the _identity_ of an object; we can use the object itself as a key on the map. This is great; for example, we'd use this to associate metadata with objects like dom elements, without writing over the properties of the element itself. 
- However, when used as a cache, we face the drawback that keys have to be manually evicted, else they stick around in memory causing a leak if it's not flushed out regularly (eventually leading you to reimplement GC for the Map. ugh). 
- WeakMaps are awesome for caches that are associated with the _identity_ of objects; they hold _weak_ references to their keys, meaning that when 'nothing' is referring to them anymore, they go poof and disappear, cleaned up with regular GC. This means you don't have to manually evict a key; e.g., when using a WeakMap with the previous example, when the dom element is destroyed, the meta data associated with it would disappear too.
- It has the drawback that the keys on the WeakMap cannot be enumerated (ie - you can't look inside the WeakMap to tell what it's holding at that moment). You also can't use strings or numbers as keys. 

Ok? ok. 

### So, what does a cache built with a WeakMap look like?

```jsx
// this takes a function as input, and returns another 
// function that applies caching on its input

function cachify(fn) {
  const cache = new WeakMap();
  return (arg) => {
    if (cache.has(arg)) {
      return cache.get(arg);
    }
    
    const value = fn(arg);
    cache.set(arg, value);
    return value;
  }
}

const cachedFn = cachify(expensiveFn);
cachedFn(x); 
cachedFn(x); // cache hit!
```

### So, how can we use it with glamor? 

Consider the core function, `css(...rules)`

- `rules` can be objects, or arrays, or other rules, but we can be sure that at a given callsite, it'll usually have a stable number of arguments, usually the same.
- `rules` are cached against their values, so we can guarantee 2 different `rules` with the same value will have the same identity.
- One thing we could also do, is use predefined objects with `css()` instead of defining fresh objects every time it's called. This way, we would pick up on the identity of the object passed in, and return a cached version if available.
    
  ```jsx 
  // instead of -

  <div className={css({ color: 'red' })} />

  // we would do

  const red = { color: 'red' };
  // ...
  <div className={css(styles.red)} />

  // or even 
  const red = css({ color: 'red' });
  // ...
  <div className={red} />  
  ```
- Indeed, we could use a babel plugin that recognizes `css()` calls with 'static' objects, and hoist those objects up to the highest scope possible. This plugin exists in glamor as `glamor/babel-hoist`. DX!!!

### What about multiple arguments?

`css()` is non commutative; i.e., `css(a, b) != css(b, a)` (or rather, might not be equal). This is a good opportunity to build a 'tree' of WeakMap nodes, keyed at levels by their respective arguments, terminating in the value of the `css()` call itself. 

That's quite a mouthful. Here's some code to wash it down. 

```jsx
const caches = [null, new WeakMap(), new WeakMap(), new WeakMap()]; // only 1, 2, and 3 element caches

function cachify(fn) {
  return (...args) => {
    if (caches[args.length]) {
      const cache = caches[args.length];
      let ctr = 0;
      
      while (ctr < args.length - 1) {      
        // navigate to the 'leaf', creating nodes as you traverse
        if (!cache.has(args[ctr])) {
          cache.set(args[ctr], new WeakMap());
        }
        cache = cache.get(args[ctr]);
        ctr++;
      }
      
      if (cache.has(args[args.length - 1])) { 
        return cache.get(args[ctr]);
      }
    }
    
    const value = fn(...args);
    
    if (caches[args.length]) {
      const cache = caches[args.length];
      let ctr = 0;

      while (ctr < args.length - 1) {
        // like above, navigate to the leaf
        cache = cache.get(args[ctr]);
        ctr++;
      }
      cache.set(args[ctr], value);
    }
    
    return value;
  }
}

css = cachify(css);
css(a, b); 
css(a, b); // cache hit!
```

### This sounds great! Any caveats?

- You'll need to polyfill WeakMap on older browsers for the above to kick in.
- This isn't useful in pathological cases, when you're dynamically defining many tens of thousands of _unique_ rules in multiple combinations. So unless you're actually geocities.com, rendering every site on the same server, you should be good. Even then, it's not too bad, you'll hit the hash caches instead of the WeakMap ones.
- We only maintain these caches for 1, 2 and 3 argument inputs. This means that the behavior isn't very explicit, and *might* lead to strange perf characteristics with more arguments passed in a single `css()` call. Buyer beware!

### About that tweet...

- I [tweeted a couple of screenshots](https://twitter.com/threepointone/status/813804426989182976/photo/1) showing how with the above work, glamor blows past other libraries in the [css-in-js peformance benchmark](https://github.com/hellofresh/css-in-js-perf-tests) that's floating around. This is kind of cheating though, and I implied that pretty heavily. What's happening there, is that the test passes in shared objects for every run, and keeps picking up the cached rule, thereby defeating the purpose of the benchmark. I contend, however, that the benchmark itself is flawed. For one, it measures server side rendering performance (sort of)... Further, caching input objects sounds like a great idea :) In the css context, expecting 'static' objects isn't strange at all, and the optimization works well.
- keen observers will note that glamor fails the nested rule test pretty hard. That's because [that test generates unique objects for every run](https://github.com/hellofresh/css-in-js-perf-tests/blob/master/src/nested-test/styles.js), missing the WeakMap cache (despite having the same 'value'). It would be interesting to be able to detect such behavior, and warn in dev mode. An idea for another day...
