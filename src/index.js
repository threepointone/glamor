import hash from './hash'

import { createMarkupForStyles } from 'react/lib/CSSPropertyOperations'

let isBrowser = typeof window !== 'undefined'

let sheet

if(isBrowser){
  let styleTag = document.createElement('style')
  styleTag.id = '_classes_'
  document.head.appendChild(styleTag)
  sheet = document.styleSheets[document.styleSheets.length - 1]

}
else {
  // todo - server side fill
  sheet = {
    rules: [],
    deleteRule: () => {},
    insertRule: () => {}
  }
}

let index = 0
let cache = {}

export function objHash(type, obj){
  return hash(type + Object.keys(obj).reduce((str, k) => str + k + obj[k], ''))
}

export function selector(type, id){
  return `[data-css-${simple(type)}="${id}"]${type !== '___' ? `:${type}` : ''}`
}

export function rule(type, style, id){
  // console.log(type, style, id)
  return `${selector(type, id)}{ ${createMarkupForStyles(style)}} `
}

export function add(type = '___', style, id = objHash(type, style)){
  // register rule
  if(!cache[id]){
    sheet.insertRule(rule(type, style, id), index++)
    cache[id] = { type, style, id }
  }

  return {[`data-css-${simple(type)}`]: id }

}

export function media(expr, style){

    if(cache[style[Object.keys(style)[0]]]){
      let id = style[Object.keys(style)[0]]
      let newId = hash(expr+id)

      if(!cache[newId]){
        console.log(rule(cache[id].type, cache[id].style, newId))
          sheet.insertRule(`@media ${expr} { ${ rule(cache[id].type, cache[id].style, newId) } }`, index++)
          cache[newId] = { expr, style, id: newId }
      }
      return {[`data-css-${simple(cache[id].type)}`]: newId }
    }
    else {

      let id = objHash(expr, style)
      if(!cache[id]){
        console.log(rule('___', style, id))
        sheet.insertRule(`@media ${expr} { ${ rule('___', style, id) } }`, index++)
        cache[id] = { expr, style, id }
      }
      return {[`data-css-___`]: id }
    }

}


export function remove(o){
  // todo
  // remove rule

  let id = o[Object.keys(o)[0]]
  let i = sheet.rules.indexOf(x => x.selectorText === selector(cache[id].type, id))
  sheet.deleteRule(i)
  delete cache[id]
  index--

}

export function style(obj, id){
  return add(undefined, obj, id)
}


// https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
function camelize(str) {
  return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
}

function simple(str){
    return str.replace(/[^a-zA-Z0-9\-_\$]/g, '')//only alphanumerics, _, -, $
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

// console.log(exports)
