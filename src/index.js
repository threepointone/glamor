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


import hash from './hash' 
import autoprefix from './autoprefix'
import { createMarkupForStyles } from 'react/lib/CSSPropertyOperations'

const isBrowser = typeof document !== 'undefined'

const isDev = (x => (x === 'development') || !x)(process.env.NODE_ENV)
const isTest = process.env.NODE_ENV === 'test' 


function log(msg) { //eslint-disable-line no-unused-vars
  console.log(msg || this) //eslint-disable-line no-console
  return this
}

// lowercase, strip out special chars etc
function simple(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '')    
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

function updateMediaQueryLabels() {
  Object.keys(cache).forEach(id => {
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

export function trackMediaQueryLabels(bool = true, period = 2000) {
  if(bool) {
    if(interval) {
      console.warn('already tracking labels, call trackMediaQueryLabels(false) to stop') // eslint-disable-line no-console 
      return 
    }
    interval = setInterval(() =>
      updateMediaQueryLabels(), period) 
  }
  else {
    clearInterval(interval)
    interval = null 
  }
  
}

// initialize global stylesheet

let cache = {}, styleSheet, styleTag

function injectStyleSheet() {
  if(isBrowser) {
    styleTag = document.getElementById('_css_')
    if(!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = styleTag.id || '_css_'
      styleTag.appendChild(document.createTextNode(''));
      (document.head || document.getElementsByTagName('head')[0]).appendChild(styleTag)
    }
    styleSheet = [ ...document.styleSheets ].filter(x => x.ownerNode === styleTag)[0]  
  }
  else {
    // server side 'polyfill'
    styleSheet  = { 
      cssRules: [],
      deleteRule: index => {
        styleSheet.cssRules = [ ...styleSheet.cssRules.slice(0, index), ...styleSheet.cssRules.slice(index + 1) ]
      },
      insertRule: (rule, index) => {
        // just enough 'spec compliance' to be able to extract the rules later  
        styleSheet.cssRules = [ ...styleSheet.cssRules.slice(0, index), { cssText: rule }, ...styleSheet.cssRules.slice(index) ]
      }
    }
  }  
}

injectStyleSheet()
if(isDev) {
  trackMediaQueryLabels(true)    
  // todo - make sure hot loading isn't broken
  // todo - clearInterval on browser close  
}

// adds a css rule to the sheet 
function appendSheetRule(rule) { // todo - tests 
  if(styleTag && styleTag.styleSheet) {
    styleTag.styleSheet.cssText+= rule
  }
  else {
    if(isBrowser) { // todo - would innerHTML be faster here? is that even a thing with styletags?
      styleTag.appendChild(document.createTextNode(rule))
    }
    else{
      styleSheet.insertRule(rule, styleSheet.cssRules.length)
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
    // simple on server 
    styleSheet.cssRules = []
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


export function styleHash(type, style) { // todo - default type = '_'. this changes all the hashes and will break tests, so do later 
  // make sure type exists
  // make sure obj is style-like?
  return hash(type + Object.keys(style).reduce((str, k) => str + k + style[k], '')).toString(36)
}

export function selector(id, type) {
  // id should exist
  let cssType = type === '_' ? '' : 
    type[0] === ' ' ? type : 
    `:${type}`
  let suffix = `[data-css-${id}]${cssType}`

  if(canSimulate && type !== '_' && cssType[0] === ':' ) {
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

function isRule(rule) {
  try{
    let id = idFor(rule)
    return  id && cache[id]
  }
  catch(e) {
    return false
  }
}

// this is the base, the rest derive off this 
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

export function style(obj) {
  return add(undefined, obj)
}

export const multi = add

export function select(selector, style) {
  return add(' ' + selector, style)
}


// todo - autogenerate this by scraping MDN
export const active = x => add('active', x)
export const any = x => add('any', x)
export const checked = x => add('checked', x)
export const disabled = x => add('disabled', x)
export const empty = x => add('empty', x)
export const enabled = x => add('enabled', x)
export const _default = x => add('default', x)
export const first = x => add('first', x)
export const firstChild = x => add('first-child', x)
export const firstOfType = x => add('first-of-type', x)
export const fullscreen = x => add('fullscreen', x)
export const focus = x => add('focus', x)
export const hover = x => add('hover', x)
export const indeterminate = x => add('indeterminate', x)
export const inRange = x => add('in-range', x)
export const invalid = x => add('invalid', x)
export const lastChild = x => add('last-child', x)
export const lastOfType = x => add('last-of-type', x)
export const left = x => add('left', x)
export const link = x => add('link', x)
export const onlyChild = x => add('only-child', x)
export const onlyOfType = x => add('only-of-type', x)
export const optional = x => add('optional', x)
export const outOfRange = x => add('out-of-range', x)
export const readOnly = x => add('read-only', x)
export const readWrite = x => add('read-write', x)
export const required = x => add('required', x)
export const right = x => add('right', x)
export const root = x => add('root', x)
export const scope = x => add('scope', x)
export const target = x => add('target', x)
export const valid = x => add('valid', x)
export const visited = x => add('visited', x)

export const dir = (p, x) => add(`dir(${p})`, x)
export const lang = (p, x) => add(`lang(${p})`, x)
export const not = (p, x) => not(`not(${p})`, x)
export const nthChild = (p, x) => add(`nth-child(${p})`, x)
export const nthLastChild = (p, x) => add(`nth-last-child(${p})`, x)
export const nthLastOfType = (p, x) => add(`nth-last-of-type(${p})`, x)
export const nthOfType = (p, x) => add(`nth-of-type(${p})`, x)

export const after = x => add(':after', x)
export const before = x => add(':before', x)
export const firstLetter = x => add(':first-letter', x)
export const firstLine = x => add(':first-line', x)
export const selection = x => add(':selection', x)
export const backdrop = x => add(':backdrop', x)
export const placeholder = x => add(':placeholder', x)

export function merge(...rules) {
  // todo - remove label from merged style?
  let labels = [], mergeLabel, styleBag = {}
  rules.forEach((rule, i) => {
    if(i === 0 && typeof rule === 'string') {
      mergeLabel = rule
      // bail early
      return
    }
    if(isRule(rule)) {
      let id = idFor(rule)      
      if(cache[id].bag) {
        let { bag, label } = cache[idFor(rule)]
        Object.keys(bag).forEach(type => {
          styleBag[type] = { ...styleBag[type] || {}, ...bag[type] }
        })
        hasLabels && labels.push('[' + label + ']')
        return 
      }
      if(cache[id].expr) {
        throw new Error('cannot merge a media rule')
      }
      else {
        let id = idFor(rule)
        let { type, style } = cache[id]
        styleBag[type] = { ...styleBag[type] || {}, ...style }
        hasLabels && labels.push((style.label || `\`${id}`) + `${type !== '_' ? `:${type}` : ''}`)
        return 
      }  
    }
    
    else {
      // plain
      styleBag._ = { ...styleBag._ || {}, ...rule }
      hasLabels && labels.push('{…}')
    }
    // return o
  })

  let id = hash(mergeLabel + JSON.stringify(styleBag)).toString(36) // todo - predictable order
  let label = hasLabels ? `${mergeLabel ? mergeLabel + '= ' : ''}${labels.length ? labels.join(' + ') : ''}` : ''
  if(!cache[id]) {
    cache[id] = { bag: styleBag, id, label }
    Object.keys(styleBag).forEach(type => {
      appendSheetRule(cssrule(id, type, styleBag[type]))
    })
  }
  // todo - bug - this doesn't update when merge label changes
  return { [`data-css-${id}`]: label }
}


export function media(expr, style) {
  // test if valid media query
  if(isRule(style)) {
    let rule = style
    let id = idFor(rule)
    // todo - collect rules and put under one 
    
    if(cache[id].bag) { // merged       
      let { bag } = cache[id]
      let newId = hash(expr+id).toString(36)
      let label = hasLabels ? `*mq [${cache[id].label}]` : ''

      if(!cache[newId]) {
        let cssRules = Object.keys(bag).map(type => cssrule(newId, type, bag[type]))
        appendSheetRule(`@media ${expr} { ${ cssRules.join('\n') } }`)
        cache[newId] = { expr, rule, id: newId }
      }      

      return { [`data-css-${newId}`]: label }
    }
    else if(cache[id].expr) { // media rule
      throw new Error('cannot apply @media onto another media rule')
    }
    else { // simple rule
      let newId = hash(expr+id).toString(36)
      let label = hasLabels ? '*mq ' + (cache[id].style.label || ('`' + id)) : ''

      if(!cache[newId]) {
        appendSheetRule(`@media ${expr} { ${ cssrule(newId, cache[id].type, cache[id].style) } }`)
        cache[newId] = { expr, rule, id: newId }
      }
      
      return { [`data-css-${newId}`]: label }
    }
  }
  
  else {

    let newId = styleHash(expr, style)
    let label = hasLabels ? '*mq ' + (style.label || '') : ''
    if(!cache[newId]) {
      appendSheetRule(`@media ${expr} { ${ cssrule(newId, '_', style) } }`)
      cache[newId] = { expr, style, id: newId }
    }
    return { [`data-css-${newId}`]: label }
  }
}

export function fontFace(font) {
  let id = hash(JSON.stringify(font)).toString(36)
  if(!cache[id]) {
    cache[id] = { id, family: font.fontFamily, font }
    // todo - crossbrowser 
    appendSheetRule(`@font-face { ${createMarkupForStyles(autoprefix(font))}}`)
  }
  return font.fontFamily
}

export function keyframes(name, kfs) {
  if(typeof name !== 'string') {
    kfs = name
    name = 'animate'
  }
  let id = hash(name + JSON.stringify(kfs)).toString(36)
  if(!cache[id]) {
    cache[id] = { id, name, kfs }
    let inner = Object.keys(kfs).map(kf => 
      `${kf} { ${ createMarkupForStyles(autoprefix(kfs[kf])) }}`
    ).join('\n')

    // todo - crossbrowser 
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
  let rules = [ ...styleSheet.cssRules ], css = rules.map(r => r.cssText).join('\n')
  if(optimized) {
    // parse out ids from html
    // reconstruct css/rules/cache to pass

    let o = { html, cache: {}, css: '' }
    let regex = /data\-css\-([a-zA-Z0-9]+)=\"\"/gm
    let match, ids = []
    while((match = regex.exec(html)) !== null) {
      ids.push(match[1])
    }
    ids.forEach(id => {
      o.cache[id] = cache[id]
      
      // todo - add fonts / animations
      o.css+= styleSheet.cssRules
        .map(x => x.cssText)
        .filter(r => new RegExp(`\\\[data\-css\-${id}\\\]`).test(r)).join('\n') + '\n'
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
