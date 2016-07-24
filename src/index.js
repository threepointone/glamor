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

let hasLabels = process.env.NODE_ENV === 'development'
export function useLabels() {
  hasLabels = true
}

export function noLabels() {
  hasLabels = false
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

function updateMediaQueryLabels() {
  Object.keys(cache).forEach(id => {
    let expr = cache[id].expr
    if(expr && hasLabels && window.matchMedia) {
      let els = document.querySelectorAll(`[data-css-${id}]`)
      let match = window.matchMedia(expr).matches ? '✓': '✕'
      let regex = /^(✓|✕|\*)mq/;
      [ ...els ].forEach(el => el.setAttribute(`data-css-${id}`,
        el.getAttribute(`data-css-${id}`).replace(regex, `${match}mq`)))
    }
  })
}

let isBrowser = typeof document !== 'undefined'

let interval

export function startMediaQueryLabelTracking(period = 2000) {
  interval = setInterval(() => {
    updateMediaQueryLabels()
  }, period)
}

export function stopMediaQueryLabelTracking() {
  clearInterval(interval)
}
if(isBrowser && process.env.NODE_ENV === 'development') {
  startMediaQueryLabelTracking()
}
// todo - make sure hot loading isn't broken
// todo - clearInterval on browser close
let sheet, styleTag

function getStyleTag() {
  styleTag = document.getElementById('_css_')
  if(!styleTag) {
    styleTag = document.createElement('style')
    styleTag.id = styleTag.id || '_css_'
    styleTag.appendChild(document.createTextNode(''));
    (document.head || document.getElementsByTagName('head')[0]).appendChild(styleTag)
  }
  sheet = [ ...document.styleSheets ].filter(sheet => sheet.ownerNode === styleTag)[0]
  return styleTag
}


if(isBrowser) {
  // init tag and sheet
  getStyleTag()
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

function insertSheetRule(rule, index) {
  if(styleTag && styleTag.styleSheet) {
    sheet.styleSheet.cssText+= rule
  }
  else {
    if(isBrowser) {
      styleTag.appendChild(document.createTextNode(rule))
    }
    else{
      sheet.insertRule(rule, index)
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
  if(type !== '_' && canSimulate && ((classes.indexOf(type) >=0) || (elements.indexOf(type) >=0) )) {
    s = s + `, [data-css-${id}][data-simulate-${simple(type)}]`
  }
  return s
}

export function cssrule(type, style, id) {
  return `${selector(id, type)}{ ${createMarkupForStyles(autoprefix(style))} } `
}

export function add(type = '_', style, id = objHash(type, style)) {
  // if fontFamily passed in -
  // check if already inserted
  // if not, do so
  // convert to
  // register rule
  if(!cache[id]) {
    // remove previous rule if exists?
    // useful for gc/named id situations?
    insertSheetRule(cssrule(type, style, id), sheet.rules.length)
    cache[id] = { type, style, id }
  }

  return { [`data-css-${id}`]: hasLabels ? style.label || (type !== '_' ? `:${type}`: '') : '' }
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
        insertSheetRule(`@media ${expr} { ${ cssrule(type, bag[type], newId) } }`, sheet.rules.length)
      })
      cache[newId] = { expr, rule, id: newId }
    }
    let label = hasLabels ? cache[id].label : '' //Object.keys(bag).map(type => bag[type].label || ('^' + id + (type === '_' ? '' : `:${type}`))) : ''

    return { [`data-css-${newId}`]: hasLabels ? `*mq [${label}]` : '' }
  }
  else if(isRule(style)) { // rule
    let id = idFor(style)
    let rule = style
    let newId = hash(expr+id).toString(36)

    if(!cache[newId]) {
      insertSheetRule(`@media ${expr} { ${ cssrule(cache[id].type, cache[id].style, newId) } }`, sheet.rules.length)
      cache[newId] = { expr, rule, id: newId }
    }
    return { [`data-css-${newId}`]: hasLabels ? '*mq ' + (cache[id].style.label || ('`' + id)) : '' }
  }
  else {

    let id = objHash(expr, style)
    if(!cache[id]) {
      insertSheetRule(`@media ${expr} { ${ cssrule('_', style, id) } }`, sheet.rules.length)
      cache[id] = { expr, style, id }
    }
    return { [`data-css-${id}`]: hasLabels ? '*mq ' + (style.label || '') : ''  }
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

  if(isBrowser) {
    styleTag && styleTag.parentNode.removeChild(styleTag)
    styleTag = null
    isBrowser && getStyleTag()
  }
  else {
    while(sheet.rules.length > 0) {
      sheet.deleteRule(sheet.rules.length -1)
    }
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

      // todo - fix the 0, 11 thing
      // todo - add fonts / animations
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
  // todo - remove label from merged style
  let labels = [], mergeLabel
  let styleBag = rules.reduce((o, rule) => {
    if(rule === rules[0] && typeof rule === 'string') {
      mergeLabel = rule
      // bail early
      return o
    }

    if(isMerged(rule)) {
      let { bag, label } = cache[idFor(rule)]
      Object.keys(bag).forEach(type => {
        o[type] = { ...o[type] || {}, ...bag[type] }
      })
      hasLabels && labels.push('[' + label + ']')
    }
    else if(isRule(rule)) {
      let id = idFor(rule)
      let { type, style } = cache[id]
      o[type] = { ...o[type] || {}, ...style }
      hasLabels && labels.push((style.label || `\`${id}`) + `${type !== '_' ? `:${type}` : ''}`)
    }
    else {
      // plain
      o._ = { ...o._ || {}, ...rule }
      hasLabels && labels.push('{…}')
    }
    return o
  }, {})

  let id = hash(mergeLabel + JSON.stringify(styleBag)).toString(36) // todo - predictable order
  let label = hasLabels ? `${mergeLabel ? mergeLabel + '= ' : ''}${labels.length ? labels.join(' + ') : ''}` : ''
  if(!cache[id]) {
    cache[id] = { bag: styleBag, id, label }
    Object.keys(styleBag).forEach(type => {
      insertSheetRule(cssrule(type, styleBag[type], id), sheet.rules.length)
    })
  }
  // todo - bug - this doesn't update when merge label changes
  return { [`data-css-${id}`]: hasLabels ? label : '' }
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

export function fontFace(font) {
  let id = hash(JSON.stringify(font))
  if(!cache[id]) {
    cache[id] = { id, family: font.fontFamily, font }
    insertSheetRule(`@font-face { ${createMarkupForStyles(autoprefix(font))}}`, sheet.rules.length)
  }
  return font.fontFamily
}

export function animation(name, keyframes) {
  if(typeof name !== 'string') {
    keyframes = name
    name = 'animate'
  }
  let id = hash(name + JSON.stringify(keyframes)).toString(36)
  if(!cache[id]) {
    cache[id] = { id, name, keyframes }
    let inner = Object.keys(keyframes).map(kf => `${kf} { ${ createMarkupForStyles(autoprefix(keyframes[kf]))}}`).join('\n')

    insertSheetRule(`@-webkit-keyframes ${name + '_' + id} { ${ inner }}`, sheet.rules.length)
    insertSheetRule(`@keyframes ${name + '_' + id} { ${ inner }}`, sheet.rules.length)
  }
  return name + '_' + id

}
