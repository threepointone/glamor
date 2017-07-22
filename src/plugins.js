import assign from 'object-assign'
const isDev = (x => (x === 'development') || !x)(process.env.NODE_ENV)

export function PluginSet(initial) {
  this.fns = initial || []
}

assign(PluginSet.prototype, {  
  add(...fns) {
    fns.forEach(fn => {
      if(this.fns.indexOf(fn) >= 0) {
        if(isDev) {
          console.warn('adding the same plugin again, ignoring') //eslint-disable-line no-console
        }
      }
      else {
        this.fns = [ fn ].concat(this.fns)
      }    
    })  
  },
  remove(fn) {
    this.fns = this.fns.filter(x => x !== fn)  
  },
  clear() {
    this.fns = []
  },
  transform(o) {
    return this.fns.reduce((o, fn) => fn(o), o)  
  }
})

import { processStyleName } from './CSSPropertyOperations'

export function fallbacks(node) {  
  let hasArray = Object.keys(node.style).map(x => Array.isArray(node.style[x])).indexOf(true) >= 0
  if(hasArray) {
    let { style } = node
    let flattened = Object.keys(style).reduce((o, key) => {
      o[key] = Array.isArray(style[key]) ? style[key].join(`; ${processStyleName(key)}: `): style[key]
      return o 
    }, {})
    // todo - 
    // flatten arrays which haven't been flattened yet 
    return assign({}, node, { style: flattened })
  }
  return node   
}

import prefixAll from 'inline-style-prefixer/static'


export function prefixes(node) {
  return assign({}, node, { style: prefixAll(node.style) })
}
