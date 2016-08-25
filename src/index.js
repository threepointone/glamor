/**** stylesheet  ****/
import { StyleSheet } from './sheet.js'
import { PluginSet, prefixes, fallbacks } from './plugins' // we include these by default 

// these here are our main 'mutable' references
export const styleSheet = new StyleSheet({ name: '_css_' }) 
// an isomorphic StyleSheet shim. hides all the nitty gritty. 

styleSheet.cache = {} // hang on some state on to this instance 

// plugins 
export const plugins = styleSheet.plugins = new PluginSet(fallbacks, prefixes)
plugins.media = new PluginSet() // neat! media, font-face, keyframes
plugins.fontFace = new PluginSet()
plugins.keyframes = new PluginSet(prefixes)

// /**************** LIFTOFF IN 3... 2... 1... ****************/
                        styleSheet.inject()                     //eslint-disable-line indent
// /****************      TO THE MOOOOOOON     ****************/

// define some constants 
const isBrowser = typeof document !== 'undefined' 
const isDev = (x => (x === 'development') || !x)(process.env.NODE_ENV)
const isTest = process.env.NODE_ENV === 'test' 

// import some helpers 
import hash from './hash'  // hashes a string to something 'unique'

// takes a string, converts to lowercase, strips out nonalphanumeric.
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
// *shouldn't* have to mess with this manually
let hasLabels = isDev

export function cssLabels(bool) {
  hasLabels = !!bool
}

// // clears out the cache and empties the stylesheet
// best for tests, though there might be some value for SSR. 
export function flush() { // todo - tests 
  styleSheet.cache = {}  
  styleSheet.flush()
  styleSheet.inject()
}

// escape hatchhhhhhh
export function insertRule(css) {
  styleSheet.insert(css)
}
// todo insertRuleOnce

// now, some functions to help deal with styles / rules 

import { createMarkupForStyles } from 'react/lib/CSSPropertyOperations' // converts a js style object to css markup
// for the umd build, we'll used browserify to extract react's 
// CSSPropertyOperations module and it's deps into ./CSSPropertyOperations 

// generates a hash for (type, style)
function styleHash(type, style) { // todo - default type = '_'. this changes all the hashes and will break tests, so do later 
  // make sure type exists
  // make sure obj is style-like?
  return hash(type + Object.keys(style).reduce((str, k) => str + k + style[k], '')).toString(36)
}

// generates a css selector for (id, type)
function selector(id, type) {
  // id should exist
  let isFullSelector = type && type[0] === '$' 
  let isParentSelector = type && type[0] === '%'
  let cssType = type === '_' ? '' :  // plain style object
    isFullSelector ? type.slice(1) : // via select()
    isParentSelector ? type.slice(1) : // via parent()
    `:${type}` // pseudo
  let result 

  if(isFullSelector) {    
    result = cssType.split(',').map(x => `[data-css-${id}]${x}`).join(',')
  }
  else if (isParentSelector) {
    // todo - attach pseudo classes if any
    result = cssType.split(',').map(x => `${x} [data-css-${id}]`).join(',')
  }
  else {
    result = `[data-css-${id}]${cssType}`  
  }

  // https://github.com/threepointone/glamor/issues/20
  result = result.replace(/\:hover/g, ':hover:nth-child(n)')  
  
  if(canSimulate && type !== '_' && !isFullSelector && !isParentSelector && cssType[0] === ':') { // todo - work with pseudo selector on full selector at least 
    result+= `, [data-css-${id}][data-simulate-${simple(type)}]`
  }
  return result
}

// ... which is then used to generate css rules 

function cssrule(id, type, style) {
  let result = plugins.apply({ id, type, style, selector: selector(id, type) })
  
  return `${result.selector}{ ${
    createMarkupForStyles(result.style)
  } } `
}

// given a rule {data-css-id: ''}, checks if it's a valid, registered id
// returns the id 
export function idFor(rule) {
  // todo - weak map hash for this?
  if(Object.keys(rule).length !== 1) throw new Error('not a rule')
  let regex = /data\-css\-([a-zA-Z0-9]+)/
  let match = regex.exec(Object.keys(rule)[0])
  if(!match) throw new Error('not a rule')
  return match[1]
}

// checks if a rule is registered
export function isRule(rule) {
  try{
    let id = idFor(rule)
    return  id && styleSheet.cache[id]
  }
  catch(e) {
    return false
  }
}

// a generic rule creator/insertor 
export function add(type = '_', style) {
  let id = styleHash(type, style), // generate a hash based on type/style, use this to 'id' the rule everywhere 
    label = ''

  if(!styleSheet.cache[id]) {    
    styleSheet.insert(cssrule(id, type, style))    
    styleSheet.cache[id] = { type, style, id }
  }
  if(hasLabels) {
    // adds a debug label 
    label = style.label || label
  }

  return { [`data-css-${id}`]: label } 
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
export function active(x) { 
  return add('active', x) 
}

export function any(x) { 
  return add('any', x) 
}

export function checked(x) { 
  return add('checked', x) 
}

export function disabled(x) { 
  return add('disabled', x) 
}

export function empty(x) { 
  return add('empty', x) 
}

export function enabled(x) { 
  return add('enabled', x) 
}

export function _default(x) { 
  return add('default', x) // note '_default' name  
}

export function first(x) { 
  return add('first', x) 
}

export function firstChild(x) { 
  return add('first-child', x) 
}

export function firstOfType(x) { 
  return add('first-of-type', x) 
}

export function fullscreen(x) { 
  return add('fullscreen', x) 
}

export function focus(x) { 
  return add('focus', x) 
}

export function hover(x) { 
  return add('hover', x) 
}

export function indeterminate(x) { 
  return add('indeterminate', x) 
}

export function inRange(x) { 
  return add('in-range', x) 
}

export function invalid(x) { 
  return add('invalid', x) 
}

export function lastChild(x) { 
  return add('last-child', x) 
}

export function lastOfType(x) { 
  return add('last-of-type', x) 
}

export function left(x) { 
  return add('left', x) 
}

export function link(x) { 
  return add('link', x) 
}

export function onlyChild(x) { 
  return add('only-child', x) 
}

export function onlyOfType(x) { 
  return add('only-of-type', x) 
}

export function optional(x) { 
  return add('optional', x) 
}

export function outOfRange(x) { 
  return add('out-of-range', x) 
}

export function readOnly(x) { 
  return add('read-only', x) 
}

export function readWrite(x) { 
  return add('read-write', x) 
}

export function required(x) { 
  return add('required', x) 
}

export function right(x) { 
  return add('right', x) 
}

export function root(x) { 
  return add('root', x) 
}

export function scope(x) { 
  return add('scope', x) 
}

export function target(x) { 
  return add('target', x) 
}

export function valid(x) { 
  return add('valid', x) 
}

export function visited(x) { 
  return add('visited', x) 
}


// parameterized pseudoclasses
export function dir(p, x) { 
  return add(`dir(${p})`, x)
}
export function lang(p, x) { 
  return add(`lang(${p})`, x)
}
export function not(p, x) { 
  // should this be a plugin?
  let selector = p.split(',').map(x => x.trim()).map(x => `:not(${x})`)
  if(selector.length === 1) {
    return add(`not(${p})`, x)  
  }
  return select(selector.join(''), x)
  
}
export function nthChild(p, x) { 
  return add(`nth-child(${p})`, x)
}
export function nthLastChild(p, x) { 
  return add(`nth-last-child(${p})`, x)
}
export function nthLastOfType(p, x) { 
  return add(`nth-last-of-type(${p})`, x)
}
export function nthOfType(p, x) { 
  return add(`nth-of-type(${p})`, x)
}

// pseudoelements
export function after(x) {
  return add(':after', x) 
}
export function before(x) {
  return add(':before', x) 
}
export function firstLetter(x) {
  return add(':first-letter', x) 
}
export function firstLine(x) {
  return add(':first-line', x) 
}
export function selection(x) {
  return add(':selection', x) 
}
export function backdrop(x) {
  return add(':backdrop', x) 
}
export function placeholder(x) {
  // https://github.com/threepointone/glamor/issues/14
  return merge(
    add(':placeholder', x),
    add(':-webkit-input-placeholder', x),
    add(':-moz-placeholder', x),
    add(':-ms-input-placeholder', x)
  )
}

// unique feature 
// when you need to define 'real' css (whatever that may be)
// https://twitter.com/threepointone/status/756585907877273600
// https://twitter.com/threepointone/status/756986938033254400
export function select(selector, _style) {
  if(typeof selector === 'object') {
    return style(selector)
  }
  //  todo - warn when missing possible space
  return add('$' + selector, _style) // signalling ahead that this is a plain selector 
}

// alias. bringin' back jquery
export const $ = select

export function parent(selector, style) {
  return add('%' + selector, style)
}

// we define a function to 'merge' styles together.
// backstory - because of a browser quirk, multiple styles are applied in the order they're 
// defined the stylesheet, not in the order of application 
// in most cases, this won't case an issue UNTIL IT DOES 
// instead, use merge() to merge styles,
// with latter styles gaining precedence over former ones 

// todo - this needs a refactor urghhh
export function merge(...rules) {
  let labels = [], mergeLabel, styleBag = {}, mediaBag = {}
  rules.forEach((rule, i) => {
    // optionally send a string as first argumnet to 'label' this merged rule  
    if(i === 0 && typeof rule === 'string') {
      mergeLabel = rule
      // bail early
      return
    }
    if(isRule(rule)) { // it's a rule!
      
      let id = idFor(rule)  
      
      if(styleSheet.cache[id].bag) { // merged rule 

        let { bag, label, media } = styleSheet.cache[id]
        Object.keys(bag).forEach(type => {
          styleBag[type] = { ...styleBag[type] || {}, ...bag[type] }
        })
        // if there's a media bag, merge those in 
        if(media) {
          Object.keys(media).forEach(expr => {
            mediaBag[expr] = mediaBag[expr] || {}
            Object.keys(media[expr]).forEach(type => {
              // mediaBag[expr][type] = mediaBag[expr][type] || {}
              mediaBag[expr][type] = { ...mediaBag[expr][type] || {}, ...media[expr][type] }
            })
          })
        }


        hasLabels && labels.push('[' + (label || '*') + ']')
        return 
        // that was fairly straightforward
      }
      
      if(styleSheet.cache[id].expr) { // media rule
        let { expr, label, rule, style } = styleSheet.cache[id]
        mediaBag[expr] = mediaBag[expr] || { }
        if(rule) {
          let iid = idFor(rule)
          if(styleSheet.cache[iid].bag) {
            // if merged rule, merge it's bag into stylebag 
            // we won't expect a mediabag in this merged rule, because it would have thrown in media (phew)

            let { bag } = styleSheet.cache[iid]
            Object.keys(bag).forEach(type => {
              mediaBag[expr][type] = { ...mediaBag[expr][type] || {}, ...bag[type] }  
            }) 
          }
          else {
            let { type, style } = styleSheet.cache[iid]  
            mediaBag[expr][type] = { ...mediaBag[expr][type] || {}, ...style }  
          }  
        }
        else {
          mediaBag[expr]._ =  { ...mediaBag[expr]._ || {}, ...style }
        }
        
        
        // mediaBag[expr].push(rule)
        hasLabels && labels.push(label)
        return

        // throw new Error('cannot merge a media rule')
      }
      else {  // simple rule 
      
        let { type, style } = styleSheet.cache[id]
        styleBag[type] = { ...styleBag[type] || {}, ...style }
        hasLabels && labels.push(style.label || '*') // todo - match 'add()'s original label
        return 
        // not too bad 
      }  
    }
    
    else {
      // plain style 
      styleBag._ = { ...styleBag._ || {}, ...rule }
      hasLabels && labels.push('{:}')
    }
  })

  // todo - remove label from merged styles? unclear. 

  let id = hash(mergeLabel + JSON.stringify(mediaBag) + JSON.stringify(styleBag)).toString(36) // todo - predictable order
  // make a merged label
  let label = hasLabels ? `${mergeLabel ? mergeLabel + '= ' : ''}${labels.length ? labels.join(' + ') : ''}` : '' // yuck 
  
  if(!styleSheet.cache[id]) {
    styleSheet.cache[id] = { bag: styleBag, id, label, ...(Object.keys(mediaBag).length > 0 ? { media: mediaBag } : {}) }
    Object.keys(styleBag).forEach(type => {      
      styleSheet.insert(cssrule(id, type, styleBag[type]))
    })
    
    Object.keys(mediaBag).forEach(expr => {
      let css = Object.keys(mediaBag[expr]).map(type => cssrule(id, type, mediaBag[expr][type]))
      let result = plugins.media.apply({ id, expr, css })
      styleSheet.insert(`@media ${result.expr} { ${ result.css.join('\n') } }`)
    })
  }
  return { [`data-css-${id}`]: label }
}

export const compose = merge 

function isMerged(id) {
  return !!styleSheet.cache[id].bag
}

function isMedia(id) {
  return !!styleSheet.cache[id].expr
}


function insertMediaRule({ id, expr, style, rule, label, css }) {
  let result = plugins.media.apply({ id, expr, css })
  styleSheet.insert(`@media ${result.expr} { ${ result.css.join('\n') } }`)  
  styleSheet.cache[id] = { expr, rule, style, id, label }  
}


// this one's for media queries 
// they cannot be merged with other queries 
// todo - we should test whether the query is valid and give dev feedback 
export function media(expr, ...rules) {
  if (rules.length > 1) {
    return media(expr, merge(...rules))
  } // todo - iterate yourself instead 
  let rule = rules[0]
  // test if valid media query
  if(isRule(rule)) {
    let id = idFor(rule)
    let spec = styleSheet.cache[id]
    if(isMerged(id)) { // merged rule        
      if(spec.media) {
        throw new Error('cannot apply a media rule onto another')
      }
      let { bag } = spec
      let newId = hash(expr+id).toString(36)
      let label = hasLabels ? `*mq [${spec.label}]` : ''

      if(!styleSheet.cache[newId]) {
        let css = Object.keys(bag).map(type => cssrule(newId, type, bag[type]))
        insertMediaRule({ id: newId, expr, rule, label, css })
      }      

      return { [`data-css-${newId}`]: label }
      // easy 
    }
    else if(isMedia(id)) { // media rule
      throw new Error('cannot apply a media rule onto another')
    }
    else { // simple rule
      let newId = hash(expr+id).toString(36)
      let label = hasLabels ? '*mq ' + (spec.style.label || '*') : ''

      if(!styleSheet.cache[newId]) {
        let css = [ cssrule(newId, spec.type, spec.style) ]
        insertMediaRule({ id: newId, expr, rule, label, css })
      }
      
      return { [`data-css-${newId}`]: label }
      // easier 
    }
  }
  
  else { // a plain style 
    let style = rule 
    let newId = styleHash(expr, style)
    let label = hasLabels ? '*mq ' + (style.label || '*') : ''
    if(!styleSheet.cache[newId]) {
      let css = [ cssrule(newId, '_', style) ]
      insertMediaRule({ id: newId, expr, style: rule, label, css })
    }
    return { [`data-css-${newId}`]: label }
  }
}

export const presets = {  
  mobile : '(min-width: 400px)',
  phablet : '(min-width: 550px)',
  tablet : '(min-width: 750px)',
  desktop : '(min-width: 1000px)',
  hd : '(min-width: 1200px)'
}

/**** live media query labels ****/

// simplest implementation -
// cycle through the cache, and for every media query
// find matching elements and update the label 
function updateMediaQueryLabels() {
  Object.keys(styleSheet.cache).forEach(id => {
    let { expr } = styleSheet.cache[id]
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
  if(!styleSheet.cache[id]) {
    styleSheet.cache[id] = { id, family: font.fontFamily, font }
    // todo - crossbrowser 
    styleSheet.insert(`@font-face { ${createMarkupForStyles(font)}}`)
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
  if(!styleSheet.cache[id]) {
    styleSheet.cache[id] = { id, name, kfs }
    let inner = Object.keys(kfs).map(kf => {
      let result = plugins.keyframes.apply({ id, name: kf, style: kfs[kf] })
      return `${result.name} { ${ createMarkupForStyles(result.style) }}`
    }).join('\n');

    [ '-webkit-', '-moz-', '-o-', '' ].forEach(prefix =>
      styleSheet.insert(`@${ prefix }keyframes ${ name + '_' + id } { ${ inner }}`))
    
  }
  return name + '_' + id

}

/*** helpers for web components ***/
// https://github.com/threepointone/glamor/issues/16

export function cssFor(...rules) {
  let ids = rules.reduce((o, r) => (o[idFor(r)] = true, o), {})
  let css = styleSheet.rules().map(({ cssText }) => {
    let regex = /\[data\-css\-([a-zA-Z0-9]+)\]/gm
    let match = regex.exec(cssText)
    
    if(match && ids[match[1]]) {
      return cssText
    }
  }).filter(x => !!x).join('\n')
  return css 
}

export function attribsFor(...rules) {
  let htmlAttributes = rules.map(rule => {
    idFor(rule) // throwaway check for rule 
    let key = Object.keys(rule)[0], value = rule[key]
    return `${key}="${value || ''}"`  
  }).join(' ')
  
  return htmlAttributes
}


// a useful utility for quickly tapping objects. use with the :: operator 
// {x: 1}::log()
// [5, 12, 90]::log().filter(x => x%5)::log()
export function log(msg) { //eslint-disable-line no-unused-vars
  console.log(msg || this) //eslint-disable-line no-console
  return this
}
