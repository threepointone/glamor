/* global describe, it, beforeEach, afterEach, before, after */
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  }
}
import 'babel-polyfill'
let isPhantom = navigator.userAgent.match(/Phantom/)

import expect from 'expect'
import expectJSX from 'expect-jsx'

expect.extend(expectJSX)

import React from 'react' //eslint-disable-line
import { render, unmountComponentAtNode } from 'react-dom'

import {
  // fontFace, keyframes,
  cssLabels,
  simulations, simulate,
  cssFor, attribsFor, idFor,
  flush, styleSheet, rehydrate, css }
from '../src'

import clean from '../src/clean'

import { createMarkupForStyles } from '../src/CSSPropertyOperations'

function childStyle(node, p = null) {
  return window.getComputedStyle(node.childNodes[0], p)
}

function getDataAttributes(node) {
  let d = {}, re_dataAttr = /^data\-(.+)$/;
  [ ...node.attributes ].forEach(attr =>  {
    if (re_dataAttr.test(attr.nodeName)) {
      let key = attr.nodeName.match(re_dataAttr)[1]
      d[key] = attr.nodeValue
    }
  })
  return d
}


describe('glamor', () => {
  let node
  beforeEach(() => {
    node = document.createElement('div')
    document.body.appendChild(node)
  })

  afterEach(() => {
    unmountComponentAtNode(node)
    document.body.removeChild(node)
    flush()
  })
})

describe('clean', () => {
  it('keeps normal objects', () => {
    const sample = { a: 'b' }
    Object.freeze(sample)
    expect(clean(sample)).toBe(sample)
  })

  it('keeps normal arrays of objects', () => {
    const sample = [ { a: 'b' }, { c: 'd' } ]
    Object.freeze(sample)
    expect(clean(sample)).toBe(sample)
  })

  it('removes falsy values from objects', () => {
    const sample = { a: 'b', c: null }
    Object.freeze(sample)
    expect(clean(sample)).toEqual({ a: 'b' })
  })

  it('removes falsy values from objects on second level', () => {
    const sample = { a: 'b', c: { d: 'd', e: {} } }
    Object.freeze(sample)
    expect(clean(sample)).toEqual({ a: 'b', c: { d: 'd' } })
  })

  it('removes falsy values from arrays', () => {
    const sample = [ 1, {}, false ]
    Object.freeze(sample)
    expect(clean(sample)).toEqual([ 1 ])
  })

  it('filters objects inside arrays', () => {
    const sample = [ 1, { x : null }, { y: 'y' } ]
    Object.freeze(sample)
    expect(clean(sample)).toEqual([ 1, { y: 'y' } ])
  })

  it('returns null for single falsy value', () => {
    expect(clean(null)).toBe(null)
    expect(clean(undefined)).toBe(null)
    expect(clean(false)).toBe(null)
    expect(clean({})).toBe(null)
  })

  it('returns null if there is no styles left after filtration', () => {
    const samples = [
      [ [ {} ] ],
      [],
      { a: { b: { x: null } } },
      [ {}, { a: { b: false } } ]
    ]
    samples.forEach(sample => {
      expect(clean(sample)).toBe(null)
    })
  })

  it('handles css variables', () => {
    expect(createMarkupForStyles({ '--myVar': 'value' })).toEqual('--myVar:value;')
    expect(createMarkupForStyles({ '--my-var': 'value' })).toEqual('--my-var:value;')
    expect(createMarkupForStyles({ '--myVar': 'value', fontSize: 20 })).toEqual('--myVar:value;font-size:20px;')
  })

})

describe('empty styles', () => {
  afterEach(flush)

  const shouldIgnore = (method, ...args) => {
    it(`${method.name} ignores empty styles`, () => {
      expect(method(...args)).toEqual({})
      expect(styleSheet.rules().length).toEqual(0)
    })
  }

  shouldIgnore(css, {})
  shouldIgnore(css, {' a': {}})
  shouldIgnore(css)

  // TODO test simulate, fontFace, keyframes, cssFor, attribsFor
})

describe('falsy values', () => {
  before(() => {
    simulations(true)
  })

  after(() => {
    simulations(false)
  })

  ;[ null, false, undefined ].forEach(falsy => {
    const check = (method, a, b) => {
      it(`${method.name} ignores ${falsy} values`, () => {
        expect(method(...a)).toEqual(method(...b))
      })
    }

    check(css,
     [ { fontSize: 10, color: falsy } ],
     [ { fontSize: 10 } ]
    )
    check(
      css,
      [ { '.foo & .bar': { fontSize: 10, color: falsy }} ],
      [ {'.foo & .bar': { fontSize: 10 }} ]
    )
    check(css,
      [ {'@media ()': { fontSize: 10, color: falsy }} ],
      [ {'@media ()': { fontSize: 10 }} ]
    )
    check(simulate,
      [ 'hover', falsy ],
      [ 'hover' ]
    )
    check(css.fontFace,
      [ { fontFamily: 'Open Sans', fontStyle: falsy } ],
      [ { fontFamily: 'Open Sans' } ]
    )
    check(css.keyframes,
      [ 'bounce', { '0%': { width: 0, height: falsy } } ],
      [ 'bounce', { '0%': { width: 0 } } ]
    )
    check(css.keyframes,
      [ 'bounce', { '0%': { width: 0 }, '100%': falsy } ],
      [ 'bounce', { '0%': { width: 0 } } ]
    )
    check(cssFor,
      [ falsy ],
      [])
    check(attribsFor,
      [ falsy ],
      []
    )
  })
  simulations(false)
})

describe('server', () => {
  let node
  beforeEach(() => {
    node = document.createElement('div')
    document.body.appendChild(node)
  })

  afterEach(() => {
    unmountComponentAtNode(node)
    document.body.removeChild(node)
    flush()
  })

  it('server side rendering', () => {
    // see tests/server.js
  })

  it('can rehydrate from serialized css/cache data', () => {

    let styleTag = document.createElement('style')
    if (styleTag.styleSheet) {
      styleTag.styleSheet.cssText += '[data-css-1ezp9xe]{ color:red; }'
    } else {
      styleTag.appendChild(document.createTextNode('[data-css-1ezp9xe]{ color:red; }'))
    }
    document.head.appendChild(styleTag)
    node.innerHTML = '<div data-css-1ezp9xe=""></div>'
    expect(childStyle(node).color).toEqual('rgb(255, 0, 0)')
    rehydrate([ '1ezp9xe' ])

   css({ color: 'red' })
   css({ color: 'blue' })
    expect(styleSheet.rules().length).toEqual(1)
    document.head.removeChild(styleTag)

  })

})

import { StyleSheet } from '../src/sheet'

describe('StyleSheet', () => {
  let sheet
  beforeEach(() => {
    sheet = new StyleSheet()
    sheet.inject()
  })

  afterEach(() => {
    sheet.flush()
  })

  it('can initialize', () => {
    expect([ ...document.styleSheets ].filter(s => s.ownerNode === sheet.tags[0]).length).toEqual(1)
    expect(sheet.tags[0].hasAttribute('data-glamor')).toEqual(true)
  })

  it('can add css', () => {

    sheet.insert('#box { color: red; }')
    let node = document.createElement('div')
    document.body.appendChild(node)
    node.innerHTML = '<div id="box"/>'
    expect (window.getComputedStyle(node.childNodes[0]).color).toEqual('rgb(255, 0, 0)')
    document.body.removeChild(node)

  })

  it('prepends @import rules', () => {
    if(isPhantom) {
      sheet.insert('#bar { color: red; }')
      sheet.insert('@import url();')
      // watch out for this ridiculous firefix bug https://github.com/threepointone/glamor/issues/142
      const rules = sheet.rules().map(x => x.cssText)
      expect(rules.length).toBe(2)
      expect(rules[0].includes('@import')).toBeTruthy()
      expect(rules[1].includes('#bar')).toBeTruthy()
    }

  })


  // it('can replace css', () => {
  //   sheet.insert('.abc { color: red; }')
  //   sheet.insert('.abc { color: blue; }')
  //   let peg1 = sheet.insert('.xyz { color: yellow; }')
  //   sheet.insert('.abc { color: orange; }')
  //   sheet.insert('.abc { color: green; }')

  //   sheet.replace(peg1, '.xyz { color: black; }')
  //   sheet.replace(peg1, '.xyz { color: gray; }')

  //   let rules = sheet.rules()
  //   expect(rules.length).toEqual(5)
  //   expect(rules[2].cssText).toEqual('.xyz { color: gray; }')

  // })

  it('can flush all the css', () => {

    sheet.insert('#box { color: red; }')
    let node = document.createElement('div')
    document.body.appendChild(node)
    node.innerHTML = '<div id="box"/>'
    expect (window.getComputedStyle(node.childNodes[0]).color).toEqual('rgb(255, 0, 0)')
    sheet.flush()
    expect (window.getComputedStyle(node.childNodes[0]).color).toEqual('rgb(0, 0, 0)')
    document.body.removeChild(node)

  })
  it('uses multiple tags')
  // run all tests in  speedy mode
})


describe('template literal', () => {
  it('converts css into a rule')
  it('scopes multiple rules into one element')
})

describe('plugins', () => {
  it('can add/remove plugins')
  it('receive and return style descriptors')
  it('plugins are run reverse to the order they\'re registered')

})

// comments everywhere

// declarations -
// color: blue
// fontWeight: 200 vs width: 300 (px)
// multiword - border: 1px solid blue - check units
// !important
// functions???

// non ascii, base 64 encoded data uris, etc


// selectors -
// pseudo
// direct
// element id class attribute pseudo
// contextual

// media queries


// custom vars/props?

// fallbacks


// a useful utility for quickly tapping objects. use with the :: operator
// {x: 1}::log()
// [5, 12, 90]::log().filter(x => x%5)::log()
export function log(msg) { //eslint-disable-line no-unused-vars
  console.log(msg || this) //eslint-disable-line no-console
  return this
}
