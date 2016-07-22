import hash from './hash'
import autoprefix from './autoprefix'

import { createMarkupForStyles } from 'react/lib/CSSPropertyOperations'

let canSimulate = process.env.NODE_ENV === 'development'

export function startSimulation() {
  canSimulate = true
}

export function stopSimulation() {
  canSimulate = false
}

let warned1 = false, warned2 = false
export function simulate(...pseudos) {
  if(!canSimulate) {
    if(!warned1) {
      console.warn('can\'t simulate without once calling startSimulation()') //eslint-disable-line no-console
      warned1 = true
    }
    if(process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test' && !warned2) {
      console.warn('don\'t use simulation outside dev') //eslint-disable-line no-console
      warned2 = true
    }
    return {}
  }
  return pseudos.reduce((o, p) => (o[`data-simulate-${simple(p)}`] = '', o), {})
}

let isBrowser = typeof document !== 'undefined'

let sheet

if(isBrowser) {
  let styleTag = document.getElementById('_css_')

  if(!styleTag) {
    styleTag = document.createElement('style')
    styleTag.id = styleTag.id || '_css_'
    styleTag.appendChild(document.createTextNode(''));
    (document.head || document.getElementsByTagName('head')[0]).appendChild(styleTag)
  }
  sheet = [ ...document.styleSheets ].filter(sheet => sheet.ownerNode === styleTag)[0]
}
else {
  sheet = {
    rules: [],
    deleteRule: index => {
      sheet.rules = [ ...sheet.rules.slice(0, index), ...sheet.rules.slice(index + 1) ]
    },
    insertRule: (rule, index) => {
      // should we include selectorText etc
      sheet.rules = [ ...sheet.rules.slice(0, index), { cssText: rule }, ...sheet.rules.slice(index) ]
    }
  }
}

let cache = {}

export function objHash(type, obj) {
  // make sure type exists
  // make sure obj is style-like?
  return hash(type + Object.keys(obj).reduce((str, k) => str + k + obj[k], '')).toString(36)
}

export function selector(id, type) {
  // id should exist
  let suffix = type === '_' ? '' : type[0] === ' ' ? type : `:${type}`
  let s = `[data-css-${id}]${suffix}`
  if(type!=='_' && canSimulate) {
    s = s + `, [data-css-${id}][data-simulate-${simple(type)}]`
  }
  return s
}

export function cssrule(type, style, id) {
  return `${selector(id, type)}{ ${createMarkupForStyles(autoprefix(style))} } `
}

export function add(type = '_', style, id = objHash(type, style)) {
  // register rule
  if(!cache[id]) {
    // remove previous rule if exists?
    // useful for gc/named id situations?
    // console.log(cssrule(type, style, id))
    sheet.insertRule(cssrule(type, style, id), sheet.rules.length)
    cache[id] = { type, style, id }
  }

  return { [`data-css-${id}`]: '' }
}

export const multi = add

export function select(selector, style, id) {
  return add(' ' + selector, style, id)
}

export function media(expr, style) {
  // test if valid media query

  if(isMerged(style)) {
    let rule = style
    let id = idFor(rule)

    let { bag } = cache[id]
    let newId = hash(expr+id).toString(36)
    if(!cache[newId]) {
      Object.keys(bag).forEach(type => {
        sheet.insertRule(`@media ${expr} { ${ cssrule(type, bag[type], newId) } }`, sheet.rules.length)
      })
      cache[newId] = { expr, rule, id: newId }
    }
    return { [`data-css-${newId}`]: '' }
  }
  else if(isRule(style)) { // rule
    let id = idFor(style)
    let rule = style
    let newId = hash(expr+id).toString(36)

    if(!cache[newId]) {
      sheet.insertRule(`@media ${expr} { ${ cssrule(cache[id].type, cache[id].style, newId) } }`, sheet.rules.length)
      cache[newId] = { expr, rule, id: newId }
    }
    return { [`data-css-${newId}`]: '' }
  }
  else {

    let id = objHash(expr, style)
    if(!cache[id]) {
      sheet.insertRule(`@media ${expr} { ${ cssrule('_', style, id) } }`, sheet.rules.length)
      cache[id] = { expr, style, id }
    }
    return { [`data-css-${id}`]: '' }
  }
}

export function remove(o) {
  // todo
  // remove rule
  throw new Error('this is not tested or anything yet! beware!') //eslint-disable-line no-console

  // let id = o[Object.keys(o)[0]]
  // let i = sheet.rules.indexOf(x => x.selectorText === selector(id, cache[id].type))
  // sheet.deleteRule(i)
  // delete cache[id]

}

export function flush() {
  // index = 0
  cache = {}
  while(sheet.rules.length>0) {
    sheet.deleteRule(sheet.rules.length -1)
  }
}

export function renderStatic(fn, optimized = false) {
  let html = fn()
  if(html === undefined) {
    throw new Error('did you forget to return from renderToString?')
  }
  let rules = [ ...sheet.rules ], css = rules.map(r => r.cssText).join('\n')
  if(optimized) {
    // parse out ids from html
    // reconstruct css/rules/cache to pass

    let o = { html, cache:{}, css: '' }
    let regex = /data\-css\-([a-zA-Z0-9]+)=\"\"/gm
    let match, ids = []
    while((match = regex.exec(html)) !== null) {
      ids.push(match[1])
    }
    ids.forEach(id => {
      o.cache[id] = cache[id]

      o.css+= sheet.rules
        .map(x => x.cssText)
        .filter(r => r.substring(0, 11 + id.length) === `[data-css-${id}]`).join('\n') + '\n'
    })
    return o

  }
  return { html, cache, css }
}

export function renderStaticOptimized(fn) {
  return renderStatic(fn, true)
}


export function rehydrate(c) {
  // load up cache
  cache = { ...cache, ...c }
  // assume css loaded separately
}

export function style(obj, id) {
  return add(undefined, obj, id)
}


// https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
function simple(str) {
  return str.replace(/(\-[a-z])/g,
    $1 =>$1.toUpperCase().replace('-',''))
    .replace(/[^a-zA-Z0-9\-_\$]/g, '')
}

let classes = [ 'active', 'any', 'checked', 'default', 'disabled', 'empty',
'enabled', 'first', 'first-child', 'first-of-type', 'fullscreen', 'focus',
'hover', 'indeterminate', 'in-range', 'invalid', 'last-child', 'last-of-type',
'left', 'link', 'only-child', 'only-of-type', 'optional', 'out-of-range',
'read-only', 'read-write', 'required', 'right', 'root', 'scope', 'target',
'valid', 'visited' ]
classes.forEach(cls => exports[simple(cls)] =
  (style, id) => add(cls, style, id))

let parameterizedClasses = [ 'dir', 'lang', 'not', 'nth-child', 'nth-last-child',
'nth-last-of-type', 'nth-of-type' ]
parameterizedClasses.forEach(cls => exports[simple(cls)] =
  (param, style, id) => add(`${cls}(${param})`, style, id))

let elements = [ 'after', 'before', 'first-letter', 'first-line', 'selection',
'backdrop', 'placeholder' ]
elements.forEach(el => exports[simple(el)] =
  (style, id) => add(`:${el}`, style, id))

function isMediaRule(rule) {
  try{
    let id = idFor(rule)
    return  id && cache[id] && cache[id].expr
  }
  catch(e) {
    return false
  }
}

function isMerged(rule) {
  try{
    let id = idFor(rule)
    return  id && cache[id] && cache[id].bag
  }
  catch(e) {
    return false
  }
}

function isRule(rule) {
  try{
    let id = idFor(rule)
    return  id && cache[id]
  }
  catch(e) {
    return false
  }
}

export function merge(...rules) {
  // todo - test for media rule
  let styleBag = rules.reduce((o, rule) => {
    if(isMerged(rule)) {
      Object.keys(rule.bag).forEach(type => {
        o[type] = { ...o[type] || {}, ...rule.bag[type] }
      })
    }
    else if(isRule(rule)) {
      let { type, style } = cache[idFor(rule)]
      o[type] = { ...o[type] || {}, ...style }
    }
    else {
      // plain
      o._ = { ...o._ || {}, ...rule }
    }
    return o
  }, {})

  let id = hash(JSON.stringify(styleBag)).toString(36) // todo - predictable order
  if(!cache[id]) {
    cache[id] = { bag: styleBag, id }
    Object.keys(styleBag).forEach(type => {
      sheet.insertRule(cssrule(type, styleBag[type], id), sheet.rules.length)
    })
  }

  return { [`data-css-${id}`]: '' }
}

function idFor(rule) {
  // todo - weak map hash for this
  if(Object.keys(rule).length !== 1) throw new Error('not a rule')
  let regex = /data\-css\-([a-zA-Z0-9]+)/
  let match = regex.exec(Object.keys(rule)[0])
  if(!match) throw new Error('not a rule')
  return match[1]
}


export function unused() {
  // rules generated vs used
  throw new Error('not implemented')
}
