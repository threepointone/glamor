const isDev = (x => (x === 'development') || !x)(process.env.NODE_ENV)

export class PluginSet {
  constructor(...initial) {
    this.fns = initial || []
  }
  add(...fns) {
    fns.forEach(fn => {
      if(this.fns.indexOf(fn) >= 0) {
        if(isDev) {
          console.warn('adding the same plugin again, ignoring') //eslint-disable-line no-console
        }
      }
      else {
        this.fns = [ fn, ...this.fns ]
      }    
    })  
  }
  remove(fn) {
    this.fns = this.fns.filter(x => x !== fn)  
  }
  clear() {
    this.fns = []
  }
  transform(o) {
    return this.fns.reduce((o, fn) => fn(o), o)  
  }
}

export function fallbacks(node) {
  let hasArray = Object.keys(node.style).map(x => Array.isArray(node.style[x])).indexOf(true) >= 0
  if(hasArray) {
    let { style, ...rest } = node
    let flattened = Object.keys(style).reduce((o, key) => {
      o[key] = Array.isArray(style[key]) ? style[key].join(`; ${key}: `): style[key]
      return o 
    }, {})
    // todo - 
    // flatten arrays which haven't been flattened yet 
    return { style: flattened, ...rest }  
  }
  return node   
}

import { autoprefix } from './autoprefix'
export function prefixes({ style, ...rest }) {
  return ({ style: autoprefix(style), ...rest })
}

export function bug20fix({ selector, style }) {
  // https://github.com/threepointone/glamor/issues/20
  // todo - only on chrome versions and server side 
  return { selector: selector.replace(/\:hover/g, ':hover:nth-child(n)') , style }
  
}

