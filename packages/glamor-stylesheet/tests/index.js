import 'babel-polyfill'
let isPhantom = navigator.userAgent.match(/Phantom/)

import expect from 'expect'

function childStyle(node, p = null) {
  return window.getComputedStyle(node.childNodes[0], p)
}
import { StyleSheet } from '../src'

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
