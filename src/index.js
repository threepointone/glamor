// first we import some helpers 
import hash from './hash'  // hashes a string to something 'unique'
import autoprefix from './autoprefix'   // adds vendor prefixes to styles 
import { createMarkupForStyles } from 'react/lib/CSSPropertyOperations' // converts a js style object to css markup

// define some constants 
const isBrowser = typeof document !== 'undefined' 
const isDev = (x => (x === 'development') || !x)(process.env.NODE_ENV)
const isTest = process.env.NODE_ENV === 'test' 


// a useful utility for quickly tapping objects. use with the :: operator 
// {x: 1}::log()
// [5, 12, 90]::log().filter(x => x%5)::log()
function log(msg) { //eslint-disable-line no-unused-vars
  console.log(msg || this) //eslint-disable-line no-console
  return this
}

// takes a string, converts to lowercase,  strip out special chars etc.
function simple(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '')    
}

/**** simulations  ****/

// a flag to enable simulation meta tags on dom nodes 
// defaults to true in dev mode. recommend *not* to 
// toggle often. 
let canSimulate = isDev

// we use these flags for issuing warnings when simulate is called 
// in prod / in incorrect order 
let warned1 = false, warned2 = false

// toggles simulation activity. shouldn't be needed in most cases 
export function simulations(bool = true) {
  canSimulate = !!bool
}

// use this on dom nodes to 'simulate' pseudoclasses
// <div {...hover({ color: 'red' })} {...simulate('hover', 'visited')}>...</div>
// you can even send in some weird ones, as long as it's in simple format 
// and matches an existing rule on the element 
// eg simulate('nthChild2', ':hover:active') etc 
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
// toggle for debug labels. 
// shouldn't have to mess with this manually
let hasLabels = isDev

export function cssLabels(bool) {
  hasLabels = !!bool
}

/**** stylesheet ****/

// these here are our main 'mutable' references
let cache = {}, // stores all the registered styles. most important, for such a small name.  
  styleTag, // reference to the <style> tag, if in browser 
  styleSheet // reference to the styleSheet object, either native on browser / polyfilled on server 
  

function injectStyleSheet() {
  if(isBrowser) {
    // this section is just weird alchemy I found online off many sources 
    // it checks to see if the tag exists; creates an empty one if not 
    styleTag = document.getElementById('_css_')
    if(!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = styleTag.id || '_css_'
      styleTag.appendChild(document.createTextNode(''));
      (document.head || document.getElementsByTagName('head')[0]).appendChild(styleTag)
    }
    // this weirdness brought to you by firefox 
    styleSheet = [ ...document.styleSheets ].filter(x => x.ownerNode === styleTag)[0]  
  }
  else {
    // server side 'polyfill'. just enough behavior to be useful.
    styleSheet  = { 
      cssRules: [],
      deleteRule: index => {
        styleSheet.cssRules = [ ...styleSheet.cssRules.slice(0, index), ...styleSheet.cssRules.slice(index + 1) ]
      },
      insertRule: (rule, index) => {
        // enough 'spec compliance' to be able to extract the rules later  
        // in other words, just the cssText field 
        styleSheet.cssRules = [ ...styleSheet.cssRules.slice(0, index), { cssText: rule }, ...styleSheet.cssRules.slice(index) ]
      }
    }
  }  
}

/**************** LIFTOFF IN 3... 2... 1... ****************/
injectStyleSheet()
/****************      TO THE MOOOOOOON     ****************/

// adds a css rule to the sheet. only used 'internally'. 
function appendSheetRule(rule) { // todo - tests 
  // more browser weirdness. I don't even know. 
  if(styleTag && styleTag.styleSheet) {
    styleTag.styleSheet.cssText+= rule
  }
  else {
    if(isBrowser) { // todo - would innerHTML be faster here? is that even a thing with styletags?
      // todo - would insertRule here be faster in production?
      styleTag.appendChild(document.createTextNode(rule))
    }
    else{
      styleSheet.insertRule(rule, styleSheet.cssRules.length)
    }
  }
}


// clears out the cache and empties the stylesheet
// best for tests, though there might be some value for SSR. 
export function flush() { // todo - tests 
  cache = {}

  if(isBrowser) {
    styleTag && styleTag.parentNode.removeChild(styleTag)
    styleTag = null
    injectStyleSheet()
  }
  else {
    // simpler on server 
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

// now, some functions to help deal with styles / rules 

// generates a hash for (type, style)
function styleHash(type, style) { // todo - default type = '_'. this changes all the hashes and will break tests, so do later 
  // make sure type exists
  // make sure obj is style-like?
  return hash(type + Object.keys(style).reduce((str, k) => str + k + style[k], '')).toString(36)
}

// generates a css selector for (id, type)
function selector(id, type) {
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

// ... which is them used to generate css rules 
function cssrule(id, type, ...styles) {
  return `${selector(id, type)}{ ${
    styles.map(style => 
      createMarkupForStyles(autoprefix(style)))
    .join('\n')    
  } } `
}

// given a rule {data-css-id: ''}, checks if it's a valid, registered id
// returns the id 
function idFor(rule) {
  // todo - weak map hash for this
  if(Object.keys(rule).length !== 1) throw new Error('not a rule')
  let regex = /data\-css\-([a-zA-Z0-9]+)/
  let match = regex.exec(Object.keys(rule)[0])
  if(!match) throw new Error('not a rule')
  return match[1]
}

// checks if a rule is registered
function isRule(rule) {
  try{
    let id = idFor(rule)
    return  id && cache[id]
  }
  catch(e) {
    return false
  }
}

// a generic rule creator/insertor 
export function add(type = '_', style) {
  let id = styleHash(type, style), // generate a hash based on type/style, use this to 'id' the rule everywhere 
    label = ''
  if(!cache[id]) {
    // add rule to sheet, update cache. easy!
    appendSheetRule(cssrule(id, type, style))
    cache[id] = { type, style, id }
  }
  if(hasLabels) {
    // adds a debug label 
    label = style.label || (type !== '_' ? `:${type}`: '')
  }

  return { [`data-css-${id}`]: label } // todo - type 
}

// with those in place, we can now define user-friendly functions for 
// defining styles on nodes 

// first up, what will probably be most commonly used.
// defines some css 'directly' on the node it's applied on
export function style(obj) {
  return add(undefined, obj)
}

// alllllll the pseudoclasses
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

// parameterized pseudoclasses
export const dir = (p, x) => add(`dir(${p})`, x)
export const lang = (p, x) => add(`lang(${p})`, x)
export const not = (p, x) => not(`not(${p})`, x)
export const nthChild = (p, x) => add(`nth-child(${p})`, x)
export const nthLastChild = (p, x) => add(`nth-last-child(${p})`, x)
export const nthLastOfType = (p, x) => add(`nth-last-of-type(${p})`, x)
export const nthOfType = (p, x) => add(`nth-of-type(${p})`, x)

// pseudoelements
export const after = x => add(':after', x)
export const before = x => add(':before', x)
export const firstLetter = x => add(':first-letter', x)
export const firstLine = x => add(':first-line', x)
export const selection = x => add(':selection', x)
export const backdrop = x => add(':backdrop', x)
export const placeholder = x => add(':placeholder', x)

// when you need multiple pseudoclasses in a single selector
// eg x:hover:visited for when hovering over visited elements 
export const multi = add

// unique feature 
// when you need to define 'real' css (whatever that may be)
// https://twitter.com/threepointone/status/756585907877273600
// https://twitter.com/threepointone/status/756986938033254400
export function select(selector, style) {
  return add(' ' + selector, style)
}

// we define a function to 'merge' styles together.
// backstory - because of a browser quirk, multiple styles are applied in the order they're 
// defined the stylesheet, not in the order of application 
// in most cases, thsi won't case an issue UNTIL IT DOES 
// instead, use merge() to merge styles,
// with latter styles gaining precedence over former ones 
export function merge(...rules) {
  
  let labels = [], mergeLabel, styleBag = {}
  rules.forEach((rule, i) => {
    // optionally send a string as first argumnet to 'label' this merged rule  
    if(i === 0 && typeof rule === 'string') {
      mergeLabel = rule
      // bail early
      return
    }
    if(isRule(rule)) { // it's a rule!
      let id = idFor(rule)  
      if(cache[id].bag) { // merged rule 
        let { bag, label } = cache[idFor(rule)]
        Object.keys(bag).forEach(type => {
          styleBag[type] = { ...styleBag[type] || {}, ...bag[type] }
        })
        hasLabels && labels.push('[' + label + ']')
        return 
        // that was fairly straightforward
      }
      if(cache[id].expr) { // media rule
        throw new Error('cannot merge a media rule')
      }
      else {  // simple rule 
        let { type, style } = cache[id]
        styleBag[type] = { ...styleBag[type] || {}, ...style }
        hasLabels && labels.push((style.label || `\`${id}`) + `${type !== '_' ? `:${type}` : ''}`) // todo - match 'add()'s original label
        return 
        // not too bad 
      }  
    }
    
    else {
      // plain style 
      styleBag._ = { ...styleBag._ || {}, ...rule }
      hasLabels && labels.push('{…}')
    }
  })

  // todo - remove label from merged styles? unclear. 

  let id = hash(mergeLabel + JSON.stringify(styleBag)).toString(36) // todo - predictable order
  // make a merged label
  let label = hasLabels ? `${mergeLabel ? mergeLabel + '= ' : ''}${labels.length ? labels.join(' + ') : ''}` : '' // yuck 
  if(!cache[id]) {
    cache[id] = { bag: styleBag, id, label }
    Object.keys(styleBag).forEach(type => {
      appendSheetRule(cssrule(id, type, styleBag[type]))
    })
  }
  // todo - bug - this doesn't update when merge label changes on hot update 
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


/**** live media query labels ****/

// simplest implementation -
// cycle through the cache, and for every media query
// find matching elements and update the label 
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

// saves a reference to the loop we trigger 
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

// in dev mode, start this up immediately 
if(isDev && isBrowser) {
  trackMediaQueryLabels(true)    
  // todo - make sure hot loading isn't broken
  // todo - clearInterval on browser close  
}

// we don't go all out for fonts as much, giving a simple font loading strategy 
// use a fancier lib if you need moar power
export function fontFace(font) {
  let id = hash(JSON.stringify(font)).toString(36)
  if(!cache[id]) {
    cache[id] = { id, family: font.fontFamily, font }
    // todo - crossbrowser 
    appendSheetRule(`@font-face { ${createMarkupForStyles(autoprefix(font))}}`)
  }
  return font.fontFamily
}

// we can add keyframes in a similar manner, but still generating a unique name 
// for including in styles. this gives us modularity, but still a natural api 
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

// the api's copied from aphrodite, with 1 key difference 
// we include *all* the css generated by the app 
// to optimize to only include generated styles on the pages 
// use renderStaticOptimized
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
    let regex = /data\-css\-([a-zA-Z0-9]+)=/gm
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
