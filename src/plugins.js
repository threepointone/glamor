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

let contentValues = ['normal', 'none', 'counter','open-quote','close-quote','no-open-quote','no-close-quote','initial','inherit']

export function contentWrap(node){
  console.log(node)
  if(node.style.content){
    let cont = node.style.content
    if(contentValues.indexOf(cont) >=0){
      return node
    }  
    if(cont.indexOf('url(') >= 0){
      return node
    }
    if((cont.charAt(0) === cont.charAt(cont.length -1)) && 
        (cont.charAt(0) === '"' || cont.charAt(0) === "'"  )){
      return node
    }
    return {...node, style: {...node.style, content: '"' + cont + '"'}}
  }
  return node  
  
}

import prefixer from './prefixer'


export function prefixes(node) {
  return assign({}, node, { style: prefixer({...node.style}) })
}
