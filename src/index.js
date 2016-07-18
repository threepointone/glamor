import hash from './hash'

import { createMarkupForStyles } from 'react/lib/CSSPropertyOperations'

let isBrowser = typeof window !== 'undefined'
let styleTag = document.createElement('style')
styleTag.id = '_pseudoclasses_'
document.head.appendChild(styleTag)
let sheet = document.styleSheets[document.styleSheets.length - 1]
let index = 0
let cache = {}

export function objHash(type, obj){
  return hash(type + Object.keys(obj).reduce((str, k) => str + k + obj[k], ''))
}

export function selector(type, id){
  return `[data-pseudo-${type}="${id}"]${type ? `:${type}` : ''}`
}

export function add(type, style, id = objHash(type, style)){
  // register rule
  if(!cache[id]){
    sheet.insertRule(`${selector(type, id)}{ ${createMarkupForStyles(style)}} `, index++)
    cache[id] = [type, style]
  }

  return {[`data-pseudo-${type}`]: id }

}

export function media(expr, ...styles){
    // o could be a style object or a {[data-*]} object
    // find corresponding type/style
    // add new rule
    // return new prop
    let id = o[Object.keys(o)[0]]

}


export function remove(o){
  // todo
  // remove rule

  let id = o[Object.keys(o)[0]]
  let i = sheet.rules.indexOf(x => x.selectorText === selector(cache[id][0], id))
  sheet.deleteRule(i)
  delete cache[id]

}

export function style(obj, id){
  return add(undefined, style, id)
}


// https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
}


let classes = ['active', 'any', 'checked', 'default', 'disabled', 'empty',
'enabled', 'first', 'first-child', 'first-of-type', 'fullscreen', 'focus',
'hover', 'indeterminate', 'in-range', 'invalid', 'last-child', 'last-of-type',
'left', 'link', 'only-child', 'only-of-type', 'optional', 'out-of-range',
'read-only', 'read-write', 'required', 'right', 'root', 'scope', 'target',
'valid', 'visited']
classes.forEach(cls => exports[camelize(cls)] =
  (style, id) => add(cls, style, id))

let parameterizedClasses = ['dir', 'lang', 'not', 'nth-child', 'nth-last-child',
'nth-last-of-type', 'nth-of-type']
parameterizedClasses.forEach(cls => exports[camelize(cls)] =
  (param, style, id) => add(`${cls}(${param})`, style, id))

let elements = ['after', 'before', 'first-letter', 'first-line', 'selection',
'backdrop', 'placeholder']
elements.forEach(el => exports[camelize(el)] =
  (style, id) => add(`:${cls}`, style, id))
