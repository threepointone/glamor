// I know, the code's a mess. It'll get better.
// Here's a doggo to calm you down.
//
//
//           ,'`-,
//        ,--'   ,/::.;
//       ,-'       ,/::,' `---.___        ___,_
//       |       ,:';:/        ;'"`;"`--./ ,-^.;--.
//       |:     ,:';,'         '         `.   ;`   `-.
//       \:.,:::/;/ -:.                   `  | `     `-.
//       \:::,'//__.;  ,;  ,  ,  :.`-.   :. |  ;       :.
//       \,',';/O)^. :'  ;  :   '__` `  :::`.       .:' )
//       |,'  |\__,: ;      ;  '/O)`.   :::`;       ' ,'
//        |`--''            \__,' , ::::(       ,'
//        `    ,            `--' ,: :::,'\   ,-'
//         | ,;         ,    ,::'  ,:::   |,'
//         |,:        .(          ,:::|   `
//         ::'_   _   ::         ,::/:|
//        ,',' `-' \   `.      ,:::/,:|
//       | : _  _   |   '     ,::,' :::
//       | \ O`'O  ,',   ,    :,'   ;::
//        \ `-'`--',:' ,' , ,,'      ::
//         ``:.:.__   ',-','        ::'
//                 `--.__, ,::.         ::'
//                |:  ::::.       ::'
//                |:  ::::::    ,::'
//      

// todo - move dev specific stuff to dev.js?


import hash from './hash' 
import autoprefix from './autoprefix'
import { createMarkupForStyles } from 'react/lib/CSSPropertyOperations'

let isBrowser = typeof document !== 'undefined'

let isDev = (x => (x === 'development') || !x)(process.env.NODE_ENV)
let isTest = process.env.NODE_ENV === 'test' 


function log(msg) { //eslint-disable-line no-unused-vars
  console.log(msg || this) //eslint-disable-line no-console
  return this
}

function contains(x) {
  return this.indexOf(x) >= 0
}


// lowercase, strip out special chars etc
function simple(str) {
  return str.replace(/(\-[a-z])/g,
    $1 =>$1.toUpperCase().replace('-',''))
    .replace(/[^a-zA-Z0-9\-_\$]/g, '')
}

/**** simulations  ****/

let canSimulate = isDev

export function simulations(bool = true) {
  canSimulate = !!bool
}

let warned1 = false, warned2 = false
export function simulate(...pseudos) {
  if(!canSimulate) {
    if(!warned1) {
      console.warn('can\'t simulate without once calling simulations(true)') //eslint-disable-line no-console
      warned1 = true
    }
    if(!isDev && !isTest && !warned2) {
      console.warn('don\'t use simulation outside dev') //eslint-disable-line no-console
      warned2 = true
    }
    return {}
  }
  return pseudos.reduce((o, p) => (o[`data-simulate-${simple(p)}`] = '', o), {})
}


/**** labels ****/

let hasLabels = isDev

export function cssLabels(bool) {
  hasLabels = !!bool
}

/**** live media query labels ****/

function updateMediaQueryLabels(ids) {
  ids.forEach(id => {
    let { expr } = cache[id]
    if(expr && hasLabels && window.matchMedia) {
      let els = document.querySelectorAll(`[data-css-${id}]`)
      let match = window.matchMedia(expr).matches ? '✓': '✕'
      let regex = /^(✓|✕|\*)mq/;
      [ ...els ].forEach(el => el.setAttribute(`data-css-${id}`,
        el.getAttribute(`data-css-${id}`).replace(regex, `${match}mq`)))
    }
  })
}

let interval

export function trackMediaQueryLabels(bool, period = 2000) {
  if(bool) {
    if(interval) {
      console.warn('already tracking labels, call trackMediaQueryLabels(false) to stop') // eslint-disable-line no-console 
      return 
    }
    interval = setInterval(() =>
      updateMediaQueryLabels(Object.keys(cache)), period) // todo - cache ref 
  }
  else {
    clearInterval(interval)
    interval = null 
  }
  
}

// kick it off 
if(isBrowser && isDev) {
  trackMediaQueryLabels()
}
// todo - make sure hot loading isn't broken
// todo - clearInterval on browser close

// initialize global stylesheet

let cache = {}, sheet, styleTag

function injectStyleSheet() {
  if(isBrowser) {
    styleTag = document.getElementById('_css_')
    if(!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = styleTag.id || '_css_'
      styleTag.appendChild(document.createTextNode(''));
      (document.head || document.getElementsByTagName('head')[0]).appendChild(styleTag)
    }
    sheet = [ ...document.styleSheets ].filter(sheet => sheet.ownerNode === styleTag)[0]  
  }
  else {
    // server side 'polyfill'
    sheet  = { 
      cssRules: [],
      deleteRule: index => {
        sheet.cssRules = [ ...sheet.cssRules.slice(0, index), ...sheet.cssRules.slice(index + 1) ]
      },
      insertRule: (rule, index) => {
        // todo - should we include selectorText etc
        sheet.cssRules = [ ...sheet.cssRules.slice(0, index), { cssText: rule }, ...sheet.cssRules.slice(index) ]
      }
    }
  }  
}


function appendSheetRule(rule) { // todo - tests 
  if(styleTag && styleTag.styleSheet) {
    sheet.styleSheet.cssText+= rule
  }
  else {
    if(isBrowser) { // todo - would innerHTML be faster here? is that even a thing with styletags?
      styleTag.appendChild(document.createTextNode(rule))
    }
    else{
      sheet.insertRule(rule, sheet.cssRules.length)
    }
  }
}

export function flush() { // todo - tests 
  cache = {}

  if(isBrowser) {
    styleTag && styleTag.parentNode.removeChild(styleTag)
    styleTag = null
    isBrowser && injectStyleSheet()
  }
  else {
    while(sheet.cssRules.length > 0) {
      sheet.deleteRule(sheet.cssRules.length -1)
    }
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

if(isBrowser) {
  injectStyleSheet()
}

export function styleHash(type, style) { // todo - default type = '_'. this changes all the hashes and will break tests, so do later 
  // make sure type exists
  // make sure obj is style-like?
  return hash(type + Object.keys(style).reduce((str, k) => str + k + style[k], '')).toString(36)
}

export function selector(id, type) {
  // id should exist
  let suffix = `[data-css-${id}]${(
    type === '_' ? '' : 
    type[0] === ' ' ? type : 
    `:${type}`
    )}`
  if(canSimulate && type !== '_' && ( classes::contains(type) || elements::contains(type) )) {
    suffix+= `, [data-css-${id}][data-simulate-${simple(type)}]`
  }
  return suffix
}

export function cssrule(id, type, ...styles) {
  return `${selector(id, type)}{ ${
    styles.map(style => 
      createMarkupForStyles(autoprefix(style)))
    .join('\n')    
  } } `
}

function idFor(rule) {
  // todo - weak map hash for this
  if(Object.keys(rule).length !== 1) throw new Error('not a rule')
  let regex = /data\-css\-([a-zA-Z0-9]+)/
  let match = regex.exec(Object.keys(rule)[0])
  if(!match) throw new Error('not a rule')
  return match[1]
}


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

// this is the base guy, the rest derive off him 
export function add(type = '_', style) {
  let id = styleHash(type, style), label = ''
  if(!cache[id]) {
    appendSheetRule(cssrule(id, type, style))
    cache[id] = { type, style, id }
  }
  if(hasLabels) {
    label = style.label || (type !== '_' ? `:${type}`: '')
  }

  return { [`data-css-${id}`]: label } // todo - type 
}

export const multi = add

export function select(selector, style) {
  return add(' ' + selector, style)
}

export function style(obj) {
  return add(undefined, obj)
}

let classes = [ 'active', 'any', 'checked'/*, 'default' */, 'disabled', 'empty', // todo - default
'enabled', 'first', 'first-child', 'first-of-type', 'fullscreen', 'focus',
'hover', 'indeterminate', 'in-range', 'invalid', 'last-child', 'last-of-type',
'left', 'link', 'only-child', 'only-of-type', 'optional', 'out-of-range',
'read-only', 'read-write', 'required', 'right', 'root', 'scope', 'target',
'valid', 'visited' ]
classes.forEach(cls => exports[simple(cls)] =
  style => add(cls, style))

let parameterizedClasses = [ 'dir', 'lang', 'not', 'nth-child', 'nth-last-child',
'nth-last-of-type', 'nth-of-type' ]
parameterizedClasses.forEach(cls => exports[simple(cls)] =
  (param, style) => add(`${cls}(${param})`, style))

let elements = [ 'after', 'before', 'first-letter', 'first-line', 'selection',
'backdrop', 'placeholder' ]
elements.forEach(el => exports[simple(el)] =
  style => add(`:${el}`, style))

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
      appendSheetRule(cssrule(id, type, styleBag[type]))
    })
  }
  // todo - bug - this doesn't update when merge label changes
  return { [`data-css-${id}`]: hasLabels ? label : '' }
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
        appendSheetRule(`@media ${expr} { ${ cssrule(newId, type, bag[type]) } }`)
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
      appendSheetRule(`@media ${expr} { ${ cssrule(newId, cache[id].type, cache[id].style) } }`)
      cache[newId] = { expr, rule, id: newId }
    }
    return { [`data-css-${newId}`]: hasLabels ? '*mq ' + (cache[id].style.label || ('`' + id)) : '' }
  }
  else {

    let id = styleHash(expr, style)
    if(!cache[id]) {
      appendSheetRule(`@media ${expr} { ${ cssrule(id, '_', style) } }`)
      cache[id] = { expr, style, id }
    }
    return { [`data-css-${id}`]: hasLabels ? '*mq ' + (style.label || '') : ''  }
  }
}

export function fontFace(font) {
  let id = hash(JSON.stringify(font))
  if(!cache[id]) {
    cache[id] = { id, family: font.fontFamily, font }
    appendSheetRule(`@font-face { ${createMarkupForStyles(autoprefix(font))}}`)
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

    appendSheetRule(`@-webkit-keyframes ${name + '_' + id} { ${ inner }}`)
    appendSheetRule(`@keyframes ${name + '_' + id} { ${ inner }}`)
  }
  return name + '_' + id

}

/**** serverside stuff ****/

export function renderStatic(fn, optimized = false) {
  let html = fn()
  if(html === undefined) {
    throw new Error('did you forget to return from renderToString?')
  }
  let rules = [ ...sheet.cssRules ], css = rules.map(r => r.cssText).join('\n')
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
      o.css+= sheet.cssRules
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
