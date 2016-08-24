import { autoprefix } from './autoprefix'
// let autoprefix = autoprefixFn(true) // add vendor prefixes 
// helper to hack around isp's array format 

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

export function prefixes({ style, ...rest }) {
  return ({ style: autoprefix(style), ...rest })
}

