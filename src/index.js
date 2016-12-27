import assign from 'object-assign'
/* stylesheet */
import { StyleSheet } from './sheet.js'
import { createMarkupForStyles } from './CSSPropertyOperations'
import clean from './clean.js'

export const styleSheet = new StyleSheet()
// an isomorphic StyleSheet shim. hides all the nitty gritty.

// /**************** LIFTOFF IN 3... 2... 1... ****************/
                        styleSheet.inject()                     //eslint-disable-line indent
// /****************      TO THE MOOOOOOON     ****************/

// convenience function to toggle speedy
export function speedy(bool) {
  return styleSheet.speedy(bool)
}

// plugins
import { PluginSet, prefixes, fallbacks } from './plugins' // we include these by default
export const plugins = styleSheet.plugins = new PluginSet([ prefixes, fallbacks ])
plugins.media = new PluginSet() // neat! media, font-face, keyframes
plugins.fontFace = new PluginSet()
plugins.keyframes = new PluginSet([ prefixes ])

// define some constants

const isDev = (process.env.NODE_ENV === 'development') || !process.env.NODE_ENV
const isTest = process.env.NODE_ENV === 'test'

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
  pseudos = clean(pseudos)
  if (!pseudos) return {}
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

// takes a string, converts to lowercase, strips out nonalphanumeric.
function simple(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}

// hashes a string to something 'unique'
// we use this to generate ids for styles
import hash from './hash'

function hashify(...objs) {
  return hash(objs.map(x => JSON.stringify(x)).join('')).toString(36)
}


// of shape { 'data-css-<id>': '' }
export function isLikeRule(rule) {
  let keys = Object.keys(rule).filter(x => x !== 'toString')
  if(keys.length !== 1) {
    return false
  }
  return !!/data\-css\-([a-zA-Z0-9]+)/.exec(keys[0])
}

// extracts id from a { 'data-css-<id>': ''} like object
export function idFor(rule) {
  let keys = Object.keys(rule).filter(x => x !== 'toString')
  if(keys.length !== 1) throw new Error('not a rule')
  let regex = /data\-css\-([a-zA-Z0-9]+)/
  let match = regex.exec(keys[0])
  if(!match) throw new Error('not a rule')
  return match[1]
}

function selector(id, path) {
  
  if(!id) {
    return path.replace(/\&/g, '')
  }
  if(!path) return `.css-${id},[data-css-${id}]`

  let x = path
    .split(',')
    .map(x => x.indexOf('&') >= 0 ?
      [ x.replace(/\&/mg, `.css-${id}`), x.replace(/\&/mg, `[data-css-${id}]`) ].join(',') // todo - make sure each sub selector has an &
      : `.css-${id}${x},[data-css-${id}]${x}`)
    .join(',')

  if(canSimulate && /^\&\:/.exec(path) && !/\s/.exec(path)) {
    x += `,.css-${id}[data-simulate-${simple(path)}],[data-css-${id}][data-simulate-${simple(path)}]`
  }
  return x

}


function toCSS({ selector, style }) {
  let result = plugins.transform({ selector, style })
  return `${result.selector}{${createMarkupForStyles(result.style) }}`
}


function deconstruct(style) {
  // we can be sure it's not infinitely nested here 
  let plain, selects, medias, supports
  Object.keys(style).forEach(key => {
    if(key.indexOf('&') >= 0) {
      selects = selects || {}
      selects[key] = style[key]
    }
    else if(key.indexOf('@media') === 0) {
      medias = medias || {}
      medias[key] = deconstruct(style[key])
    }
    else if(key.indexOf('@supports') === 0) {
      supports = supports || {}
      supports[key] = deconstruct(style[key])
    }
    else if(key === 'label') {
      if(style.label.length > 0) {
        plain = plain || {}
        plain.label = hasLabels ? style.label.join('.') : ''
      }      
    }
    else {
      plain = plain || {}
      plain[key] = style[key]
    }
  })
  return { plain, selects, medias, supports }
}

function deconstructedStyleToCSS(id, style) {
  let css = []
  
  // plugins here
  let { plain, selects, medias, supports } = style
  if(plain) {
    css.push(toCSS({ style: plain, selector: selector(id) }))
  }
  if(selects) {
    Object.keys(selects).forEach(key => 
      css.push(toCSS({ style: selects[key], selector: selector(id, key) })))
  }
  if(medias) {
    Object.keys(medias).forEach(key => 
      css.push(`${key}{${ deconstructedStyleToCSS(id, medias[key]).join('')}}`))
  }
  if(supports) {
    Object.keys(supports).forEach(key => 
      css.push(`${key}{${ deconstructedStyleToCSS(id, supports[key]).join('')}}`))    
  }
  return css
}

// this cache to track which rules have
// been inserted into the stylesheet
let inserted = styleSheet.inserted = {}

// and helpers to insert rules into said styleSheet
function insert(spec) {
  if(!inserted[spec.id]) {
    inserted[spec.id] = true
    let deconstructed = deconstruct(spec.style)
    deconstructedStyleToCSS(spec.id, deconstructed).map(cssRule =>
      styleSheet.insert(cssRule))
  }
}


// a simple cache to store generated rules
let registered =  styleSheet.registered = {}
function register(spec) {
  if(!registered[spec.id]) {
    registered[spec.id] = spec
  }
}

function _getRegistered(rule) {
  if(isLikeRule(rule)) {
    let ret = registered[idFor(rule)]
    if(ret == null) {
      throw new Error('[glamor] an unexpected rule cache miss occurred. This is probably a sign of multiple glamor instances in your app. See https://github.com/threepointone/glamor/issues/79')
    }
    return ret
  }
  return rule
}

// todo - perf
let ruleCache = {}
function toRule(spec) {
  register(spec)
  insert(spec)
  if(ruleCache[spec.id]) {
    return ruleCache[spec.id]
  }

  let ret = { [`data-css-${spec.id}`]: hasLabels ? spec.label || '' : '' }
  Object.defineProperty(ret, 'toString', {
    enumerable: false, value() { return 'css-' + spec.id }
  })
  ruleCache[spec.id] = ret
  return ret
}

function log() { //eslint-disable-line no-unused-vars
  console.log(this) //eslint-disable-line no-console
  return this
}

function isSelector(key) {
  let possibles = [ ':', '.', '[', '>', ' ' ], found = false, ch = key.charAt(0)
  for(let i=0;i< possibles.length;i++) {
    if(ch === possibles[i]) {
      found = true
      break
    }    
  }
  return found || (key.indexOf('&') >= 0)
}

function joinSelectors(a, b) {
  let as = a.split(',').map(a => !(a.indexOf('&') >= 0) ? '&' + a : a)
  let bs = b.split(',').map(b => !(b.indexOf('&') >= 0) ? '&' + b : b)

  return bs.reduce((arr, b) => arr.concat(as.map(a => b.replace(/\&/g, a))), []).join(',')
}

function joinMediaQueries(a, b) {
  return a ? `@media ${a.substring(6)} and ${b.substring(6)}` : b
}

function isMediaQuery(key) {
  return key.indexOf('@media') === 0
}

function isSupports(key) {
  return key.indexOf('@supports') === 0
}

function joinSupports(a, b) {
  return a ? `@supports ${a.substring(9)} and ${b.substring(9)}` : b
}

// flatten a nested array
function flatten(inArr) {
  let arr = []
  for(let i=0; i<inArr.length; i++) {
    if(Array.isArray(inArr[i]))
      arr = arr.concat(flatten(inArr[i]))
    else
      arr = arr.concat(inArr[i])
  }
  return arr
}


// mutable! modifies dest.
function build(dest, { selector = '', mq = '', supp = '', src = {} }) {

  if(!Array.isArray(src)) {
    src = [ src ]
  }
  src = flatten(src)

  src.forEach(_src => {
    if(isLikeRule(_src)) {
      let reg = _getRegistered(_src)
      if(reg.type !== 'css') { throw new Error('cannot merge this rule') }
      _src = reg.style
    }
    _src = clean(_src)
    if(_src && _src.composes) {
      build(dest, { selector, mq, supp, src: _src.composes })
    }
    Object.keys(_src || {}).forEach(key => {
      if(isSelector(key)) {
        selector = 
          selector === '::placeholder' ? 
            '::placeholder, ::-webkit-input-placeholder, ::-moz-placeholder, ::-ms-input-placeholder' 
            : selector

        build(dest, { selector: joinSelectors(selector, key), mq, supp, src: _src[key] })
      }
      else if(isMediaQuery(key)) {
        build(dest, { selector, mq: joinMediaQueries(mq, key), supp, src: _src[key] })          
      }
      else if(isSupports(key)) {
        build(dest, { selector, mq, supp: joinSupports(supp, key), src: _src[key] })  
      }
      else if(key === 'composes') {
        // ignore, we already dealth with it
      }
      else {
        let _dest = dest 
        if(supp) {
          _dest[supp] = _dest[supp] || {}
          _dest = _dest[supp]
        }
        if(mq) {
          _dest[mq] = _dest[mq] || {}
          _dest = _dest[mq]
        }
        if(selector) {
          _dest[selector] = _dest[selector] || {}
          _dest = _dest[selector]
        }
        
        if(key === 'label') {
          if(hasLabels) {
            dest.label = dest.label.concat(_src.label)  
          }
          
        }        
        else {
          _dest[key] = _src[key]
        }
        
      }
    })  
  }) 
}

function _css(rules) {
  let style = { label: [] }
  build(style, { src: rules }) // mutative! but worth it. 

  let spec = {
    id: hashify(style),
    style, label: hasLabels ? style.label.join('.') : '',
    type: 'css'    
  }
  return toRule(spec)  
}

let nullrule = {
  // 'data-css-nil': ''
}
Object.defineProperty(nullrule, 'toString', {
  enumerable: false, value() { return 'css-nil' }
})


export function css(...rules) {
  if(rules[0] && rules[0].length && rules[0].raw) {
    throw new Error('you forgot to include glamor/babel in your babel plugins.')
  }
  
  rules = clean(rules)
  if(!rules) {    
    return nullrule // todo - nullrule 
  }
  
  return _css(rules)
}

css.insert = (css) => {
  let spec = {
    id: hashify(css),
    css,
    type: 'raw'
  }
  register(spec)
  if(!inserted[spec.id]) {
    styleSheet.insert(spec.css)
    inserted[spec.id] = true
  }
}

export const insertRule = css.insert

css.global = (selector, style) => {
  return css.insert(toCSS({ selector, style }))
}

export const insertGlobal = css.global


function insertKeyframe(spec) {
  if(!inserted[spec.id]) {
    let inner = Object.keys(spec.keyframes).map(kf => {
      let result = plugins.keyframes.transform({ id: spec.id, name: kf, style: spec.keyframes[kf] })
      return `${result.name}{${ createMarkupForStyles(result.style) }}`
    }).join('');

    [ '-webkit-', '-moz-', '-o-', '' ].forEach(prefix =>
      styleSheet.insert(`@${ prefix }keyframes ${ spec.name + '_' + spec.id }{${ inner }}`))

    inserted[spec.id] = true
  }
}
css.keyframes = (name, kfs) => {
  if(!kfs) {
    kfs = name,
    name='animation'
  }

  // do not ignore empty keyframe definitions for now.
  kfs = clean(kfs) || {}
  let spec = {
    id: hashify(name, kfs),
    type: 'keyframes',
    name,
    keyframes: kfs
  }
  register(spec)
  insertKeyframe(spec)
  return name + '_' + spec.id
}


// we don't go all out for fonts as much, giving a simple font loading strategy
// use a fancier lib if you need moar power
css.fontFace = (font) => {
  font = clean(font)
  let spec = {
    id: hashify(font),
    type:'font-face',
    font
  }
  register(spec)
  insertFontFace(spec)

  return font.fontFamily
}


export const fontFace = css.fontFace
export const keyframes = css.keyframes


function insertFontFace(spec) {
  if(!inserted[spec.id]) {
    styleSheet.insert(`@font-face{${createMarkupForStyles(spec.font)}}`)
    inserted[spec.id] = true
  }
}


// rehydrate the insertion cache with ids sent from
// renderStatic / renderStaticOptimized
export function rehydrate(ids) {
  // load up ids
  assign(inserted, ids.reduce((o, i) => (o[i] = true, o), {}) )
  // assume css loaded separately
}


// clears out the cache and empties the stylesheet
// best for tests, though there might be some value for SSR.

export function flush() {
  inserted = styleSheet.inserted = {}
  registered = styleSheet.registered = {}
  ruleCache = {}
  styleSheet.flush()
  styleSheet.inject()

}

export const presets = {
  mobile : '(min-width: 400px)',
  Mobile: '@media (min-width: 400px)',
  phablet : '(min-width: 550px)',
  Phablet : '@media (min-width: 550px)',
  tablet : '(min-width: 750px)',
  Tablet : '@media (min-width: 750px)',
  desktop : '(min-width: 1000px)',
  Desktop : '@media (min-width: 1000px)',
  hd : '(min-width: 1200px)',
  Hd : '@media (min-width: 1200px)'
}

export const style = css

export function select(selector, ...styles) {
  if(!selector) {
    return style(styles)
  }
  return css({ [selector]: styles }) 
}
export const $ = select

export function parent(selector, ...styles) {
  return css({ [`${selector} &`]: styles })
}

export const merge = css 
export const compose = css 

export function media(query, ...rules) {
  return css({ [`@media ${query}`]: rules })
}

export function pseudo(selector, ...styles) {
  return css({ [selector]: styles }) 
}

// allllll the pseudoclasses

export function active(x) {
  return pseudo(':active', x)
}

export function any(x) {
  return pseudo(':any', x)
}

export function checked(x) {
  return pseudo(':checked', x)
}

export function disabled(x) {
  return pseudo(':disabled', x)
}

export function empty(x) {
  return pseudo(':empty', x)
}

export function enabled(x) {
  return pseudo(':enabled', x)
}

export function _default(x) {
  return pseudo(':default', x) // note '_default' name
}

export function first(x) {
  return pseudo(':first', x)
}

export function firstChild(x) {
  return pseudo(':first-child', x)
}

export function firstOfType(x) {
  return pseudo(':first-of-type', x)
}

export function fullscreen(x) {
  return pseudo(':fullscreen', x)
}

export function focus(x) {
  return pseudo(':focus', x)
}

export function hover(x) {
  return pseudo(':hover', x)
}

export function indeterminate(x) {
  return pseudo(':indeterminate', x)
}

export function inRange(x) {
  return pseudo(':in-range', x)
}

export function invalid(x) {
  return pseudo(':invalid', x)
}

export function lastChild(x) {
  return pseudo(':last-child', x)
}

export function lastOfType(x) {
  return pseudo(':last-of-type', x)
}

export function left(x) {
  return pseudo(':left', x)
}

export function link(x) {
  return pseudo(':link', x)
}

export function onlyChild(x) {
  return pseudo(':only-child', x)
}

export function onlyOfType(x) {
  return pseudo(':only-of-type', x)
}

export function optional(x) {
  return pseudo(':optional', x)
}

export function outOfRange(x) {
  return pseudo(':out-of-range', x)
}

export function readOnly(x) {
  return pseudo(':read-only', x)
}

export function readWrite(x) {
  return pseudo(':read-write', x)
}

export function required(x) {
  return pseudo(':required', x)
}

export function right(x) {
  return pseudo(':right', x)
}

export function root(x) {
  return pseudo(':root', x)
}

export function scope(x) {
  return pseudo(':scope', x)
}

export function target(x) {
  return pseudo(':target', x)
}

export function valid(x) {
  return pseudo(':valid', x)
}

export function visited(x) {
  return pseudo(':visited', x)
}

// parameterized pseudoclasses
export function dir(p, x) {
  return pseudo(`:dir(${p})`, x)
}
export function lang(p, x) {
  return pseudo(`:lang(${p})`, x)
}
export function not(p, x) {
  // should this be a plugin?
  let selector = p.split(',').map(x => x.trim()).map(x => `:not(${x})`)
  if(selector.length === 1) {
    return pseudo(`:not(${p})`, x)
  }
  return select(selector.join(''), x)

}
export function nthChild(p, x) {
  return pseudo(`:nth-child(${p})`, x)
}
export function nthLastChild(p, x) {
  return pseudo(`:nth-last-child(${p})`, x)
}
export function nthLastOfType(p, x) {
  return pseudo(`:nth-last-of-type(${p})`, x)
}
export function nthOfType(p, x) {
  return pseudo(`:nth-of-type(${p})`, x)
}

// pseudoelements
export function after(x) {
  return pseudo('::after', x)
}
export function before(x) {
  return pseudo('::before', x)
}
export function firstLetter(x) {
  return pseudo('::first-letter', x)
}
export function firstLine(x) {
  return pseudo('::first-line', x)
}
export function selection(x) {
  return pseudo('::selection', x)
}
export function backdrop(x) {
  return pseudo('::backdrop', x)
}
export function placeholder(x) {
  // https://github.com/threepointone/glamor/issues/14
  return css({ '::placeholder': x })    
}


/*** helpers for web components ***/
// https://github.com/threepointone/glamor/issues/16

export function cssFor(...rules) {  
  rules = clean(rules)
  return rules ? rules.map(r => {
    let style = { label: [] }
    build(style, { src: r }) // mutative! but worth it.   
    return deconstructedStyleToCSS(hashify(style), deconstruct(style)).join('')
  }).join('') : ''
}

export function attribsFor(...rules) {
  rules = clean(rules)
  let htmlAttributes = rules ? rules.map(rule => {
    idFor(rule) // throwaway check for rule
    let key = Object.keys(rule)[0], value = rule[key]
    return `${key}="${value || ''}"`
  }).join(' ') : ''

  return htmlAttributes
}

