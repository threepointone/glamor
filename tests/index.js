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

import { style, hover, nthChild, firstLetter, media, merge, compose,  select, visited, 
  parent,
  // fontFace, keyframes,
  cssLabels,
  simulations, simulate,
  cssFor, attribsFor, idFor,
  presets,
  flush, styleSheet, rehydrate, css }
from '../src'

import { propMerge } from '../src/react'

import clean from '../src/clean'

import { View } from '../src/jsxstyle'

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

  it('applies the style to a given node', () => {
    render(<div {...style({ backgroundColor: 'red' })}/>, node, () => {
      expect(childStyle(node).backgroundColor).toEqual('rgb(255, 0, 0)')
    })
  })

  it('only adds a data attribute to the node', () => {
    let el = <div {...style({ backgroundColor: '#0f0' })} />
    
    render(el, node, () => {
      expect(childStyle(node).backgroundColor).toEqual('rgb(0, 255, 0)')
      expect(el).toEqualJSX(<div data-css-1xre5mc=""/>)
    })
  })

  it('becomes a classname when treated as a string', () => {
    let el = <div className={style({ backgroundColor: '#0f0' }) + ' wellnow'} />
    
    render(el, node, () => {
      expect(childStyle(node).backgroundColor).toEqual('rgb(0, 255, 0)')
      expect(el).toEqualJSX(<div className="css-1xre5mc wellnow"/>)
    })
  })

  it('correctly handles display:flex', () => {
    let d = document.documentElement.style
    if (('flexWrap' in d) || ('WebkitFlexWrap' in d) || ('msFlexWrap' in d)) {
      render(<div {...style({ display: 'flex' })}/>, node, () => {
        expect(childStyle(node).display).toMatch(/flex/)
      })
    }
    
  })

  it('multiple styles can be combined', () => {
    // 2 methods

    // 1. when you don't expect key clashes and don't worry about precedence
    render(<div {...style({ width: 100 })} {...style({ height: 100 })} {...hover({ height: 200 })}/>, node, () => {
      expect(childStyle(node).height).toEqual('100px')
    })
    // 2. when you need fine grained control over which keys get prcedence,
    // manually merge your styles together
    render(<div {...style({ ...{ width: 100 }, ...{ height: 100 } } )} />, node, () => {
      expect(childStyle(node).height).toEqual('100px')
    })

    
  })

  it('accepts nested objects', () => {
    simulations(true)
    render(<div {...style({ 
      color: '#ccc', 
      ':hover': { color: 'blue' }, 
      '> .x' : { color: 'yellow' },
      '.a & .c': { color: 'green' } 
    })} {...simulate('hover')} ><span className='x' /></div>, node, () => {
      simulations(false)
      expect(childStyle(node).color).toEqual('rgb(0, 0, 255)')  
      expect(childStyle(node.childNodes[0]).color).toEqual('rgb(255, 255, 0)')  
    })
  })

  it('accepts nested media queries', () => {
    if(!isPhantom) return 
    style({
      color: 'red',
      ':hover': {
        color: 'blue'
      },
      '@media(min-width: 300px)': {
        color: 'green',
        ':hover': {
          color: 'yellow'
        },
        '.a & .c': { color: 'wheat' },
        '&&': { color: 'ivory' }
      }
    })


    expect(styleSheet.rules().map(x => x.cssText).join('\n')).toEqual(
`.css-1j2tyha, [data-css-1j2tyha] { color: red; }
.css-1j2tyha:hover, [data-css-1j2tyha]:hover { color: blue; }
@media (min-width: 300px) { 
  .css-1j2tyha, [data-css-1j2tyha] { color: green; }
  .css-1j2tyha:hover, [data-css-1j2tyha]:hover { color: yellow; }
  .a .css-1j2tyha .c, .a [data-css-1j2tyha] .c { color: rgb(245, 222, 179); }
  .css-1j2tyha.css-1j2tyha, [data-css-1j2tyha][data-css-1j2tyha] { color: rgb(255, 255, 240); }
}`)
  })

  it('nested objects can compose with `composes`', () => {
    let rule1 = style({ color: 'red' })
    let rule2 = style({ color: 'blue' })
    // let rule3 = style({ color: 'green' })
    let rule4 = style({
      composes: [ rule1, rule2 ],
      fontWeight: 'bold'
    })
    
    render(<div {...rule4}/>, node, () => {
      expect(childStyle(node).color).toEqual('rgb(0, 0, 255)')
    })
  })

  it(':not() selector works for multiple selectors')
  it('can use a parent selector to target itself', () => {
    let x = parent('.foo', { color: 'red' })
    render(<div>
      <div className="foo">
        <span {...x}>target</span>
      </div>
      <div className="bar">
        <span {...x}>target</span>
      </div>
    </div>, node, () => {
      let els = node.querySelectorAll(`[${Object.keys(x)[0]}]`)
      expect(window.getComputedStyle(els[0]).color).toEqual('rgb(255, 0, 0)')
      expect(window.getComputedStyle(els[1]).color).toEqual('rgb(0, 0, 0)')
    })
  })

  it('reuses common styles', () => {
    render(<div>
        <div {...style({ backgroundColor: 'blue' })}></div>
        <div {...style({ backgroundColor: 'red' })}></div>
        <div {...style({ backgroundColor: 'blue' })}></div>
      </div>, node, () => {

        // only 2 rules get added to the stylesheet
        
        expect(
          styleSheet.rules().map(x => x.cssText).filter(x => !!x.trim()).length          
          ).toEqual(2)

        let [ id0, id1, id2 ] = [ 0, 1, 2 ].map(i => getDataAttributes(node.childNodes[0].childNodes[i]))
        expect(id0).toEqual(id2) // first and third elements have the same hash
        expect(id0).toNotEqual(id1)   // not the second
      })
  })

  it('doesn\'t touch style/className', () => {
    render(<div {...style({ color: 'red' })} className="whatever" style={{ color: 'blue' }}/>, node, () => {
      expect(childStyle(node).color).toEqual('rgb(0, 0, 255)')
      expect(node.childNodes[0].className).toEqual('whatever')
    })
  })

  it('can style pseudo classes', () => {
    render(<div {...hover({ color: 'red' })}/>, node, () => {
      // console.log(childStyle(node, ':hover').getPropertyValue('color'))
      // ^ this doesn't work as I want
      expect(styleSheet.inserted).toEqual({ 'vnqrqn': true })
        // any ideas on a better test for this?
    })
  })

  it('can simulate pseudo classes', () => {
    // start simulation mode
    simulations(true)
    render(<div {...hover({ backgroundColor: 'red' })} {...simulate('hover')}/>, node, () => {
      simulations(false)
      expect(childStyle(node).backgroundColor).toEqual('rgb(255, 0, 0)')
      // turn it off
      
    })

  })

  it('can style parameterized pseudo classes', () => {
    let rule = nthChild(2, { color: 'red ' })
    render(<div>
        <div {...rule} />
        <div {...rule} />
        <div {...rule} />
        <div {...rule} />
      </div>, node, () => {
        expect([ 0, 1, 2, 3 ].map(i =>
          parseInt(window.getComputedStyle(node.childNodes[0].childNodes[i]).color.slice(4), 10)))
          .toEqual([ 0, 255, 0, 0 ])
      })
  })

  it('can simulate parameterized pseudo classes', () => {
    simulations(true)
    render(<div
        {...nthChild(2, { backgroundColor: 'blue' })}
        {...simulate(':nth-child(2)')}
      />, node, () => {
        simulations(false)
        expect(childStyle(node).backgroundColor).toEqual('rgb(0, 0, 255)')
        
      })
    // you can use nthChild2 nth-child(2) :nth-child(2), whatever.
    // only if there exists a similar existing rule to match really would it work anyway
  })

  it('can style pseudo elements', () => {
    render(<div {...firstLetter({ color:'red' })} />, node, () => {
      expect(styleSheet.rules()[0].cssText)
        .toEqual('.css-dde0vi::first-letter, [data-css-dde0vi]::first-letter { color: red; }')
    })
  }) // how do I test this?

  
  it('can style media queries', () => {
    // we assume phantomjs/chrome/whatever has a width > 300px
    function last(arr) {
      return arr[arr.length -1]
    }
    render(<div {...media('(min-width: 300px)', style({ color: 'red' }))}/>, node, () => {
      expect(childStyle(node).color).toEqual('rgb(255, 0, 0)')
      expect(last(styleSheet.rules()).cssText.replace(/\s/g,'').replace('alland', '')) // ie quirk
        .toEqual('@media(min-width:300px){.css-akwl3q,[data-css-akwl3q]{color:red;}}'.replace(/\s/g,''))
        // ugh
    })

  })

  it('can target pseudo classes/elements inside media queries', () => {
    simulations(true)
    render(<div {...media('(min-width: 300px)', hover({ color: 'red' }))} {...simulate('hover')}/>, node, () => {
      expect(childStyle(node).color).toEqual('rgb(255, 0, 0)')
      expect(styleSheet.inserted).toEqual({ 'omf2yv': true, 'vnqrqn': true })
      simulations(false)
    })


  })
  
  it('can merge rules', () => {
    simulations(true)
    let blue = style({ backgroundColor: 'blue' }),
      red = style({ backgroundColor: 'red', color: 'yellow' }),
      hoverGn = hover({ color: 'green' })

    render(<div {...merge(red, blue, hoverGn)} />, node, () => {
      expect(childStyle(node).backgroundColor).toEqual('rgb(0, 0, 255)')
    })
    let sheetLength = styleSheet.rules().length

    render(<div {...merge(red, blue, hoverGn)} {...simulate('hover')}/>, node, () => {
      expect(childStyle(node).color).toEqual('rgb(0, 128, 0)')
      expect(styleSheet.rules().length).toEqual(sheetLength)
    })
    simulations(false)
  })

  // how to test media queries?
  it('can simulate media queries')

  it('has an escape hatch', () => {
    render(<div {...select(' .item', { color: 'red' }) }>
      <span>this is fine</span>
      <span className="item">this is red</span>
    </div>, node, () => {
      let top = node.childNodes[0]
      let first = top.childNodes[0]
      let second = top.childNodes[1]
      expect(window.getComputedStyle(first).color).toEqual('rgb(0, 0, 0)')
      expect(window.getComputedStyle(second).color).toEqual('rgb(255, 0, 0)')
    })
    // todo - test classnames, operators combos
  })
  it('select() accepts contextual selectors', () => {
    render(<div className='up'>
        <div {...select('.up & .down', { color: 'red' })}>
          <div className='down'>hello world</div>
          <div className='notdown'>hello world</div>
        </div>
      </div>, node, () => {
        expect(window.getComputedStyle(node.querySelector('.down')).color).toEqual('rgb(255, 0, 0)')
        expect(window.getComputedStyle(node.querySelector('.notdown')).color).toEqual('rgb(0, 0, 0)')
        expect(styleSheet.rules().map(x => x.cssText).join('').replace(/\s/g,'')).toEqual('.up.css-1sk4o1x.down,.up[data-css-1sk4o1x].down{color:red;}')
      })
  })

  it('generates debug labels', () => {
    cssLabels(true)
    let red = style({ label: 'red', color: 'red' }),
      hoverBlue = hover({ label: 'blue', color: 'blue' }),
      text = merge(red, hoverBlue),
      container = merge(text, visited({ fontWeight: 'bold' }),
        { color: 'gray' }),
      mq = media('(min-width: 500px)', text)

    let el = <div {...container}>
      <ul {...style({ label: 'mylist' })}>
        <li {...hover({ color: 'green' })}>one</li>
        <li >two</li>
        <li {...mq}>three</li>
      </ul>
    </div>
    
    expect(el).toEqualJSX(<div data-css-1kmgssg="red.blue">
      <ul data-css-2n5rz6="mylist">
        <li data-css-165e3g5="">one</li>
        <li>two</li>
        <li data-css-1tjidk0="red.blue">three</li>
      </ul>
    </div>)
    cssLabels(false)

  })
  // plain rules
  // merged rules
  // media query wrap / override?

  if(isPhantom) {
    it('adds vendor prefixes', () => {
      render(<div {...style({ color: 'red', transition: 'width 2s' })} />, node, () => {
        expect(styleSheet.rules()[0].cssText)
          .toEqual('.css-19hf94w, [data-css-19hf94w] { color: red; -webkit-transition: width 2s; transition: width 2s; }')
      })
    })


    it('should be able to add fonts', () => {
      // todo - doesn't look like unicode-range works
      const latin =  {
        fontFamily: 'Open Sans',
        fontStyle: 'normal',
        fontWeight: 400,
        src: "local('Open Sans'), local('OpenSans'), url(https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3ZBw1xU1rKptJj_0jans920.woff2) format('woff2')"
      }

      let f = css.fontFace(latin)
      expect(styleSheet.rules()[0].cssText.replace(/\s/g,''))
        .toEqual("@font-face { font-family: 'Open Sans'; font-style: normal; font-weight: 400; src: local(Open Sans), local(OpenSans), url(https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3ZBw1xU1rKptJj_0jans920.woff2) format(woff2); }".replace(/\s/g,''))
      expect(f).toEqual('Open Sans')

    })

    it('can add animation keyframes', () => {
      let animate = css.keyframes('bounce', {
        '0%': {
          transform: 'scale(0.1)',
          opacity: 0
        },
        '60%': {
          transform: 'scale(1.2)',
          opacity: 1
        },
        '100%': {
          transform: 'scale(1)'
        }
      })
      expect(styleSheet.rules()[0].cssText.replace(/\s/g,''))
        .toEqual(`@-webkit-keyframes bounce_zhy6v5 { \n  0% { opacity: 0; -webkit-transform: scale(0.1); }\n  60% { opacity: 1; -webkit-transform: scale(1.2); }\n  100% { -webkit-transform: scale(1); }\n}`.replace(/\s/g,''))
      expect(animate).toEqual('bounce_zhy6v5')

    })
  }

  it('can generate css from rules', () => {
    let red = style({ color: 'red' }),
      blue = hover({ color: 'blue' }),
      merged = compose(red, blue)

    expect(cssFor(red, merged))
      .toEqual('.css-1ezp9xe,[data-css-1ezp9xe]{color:red;}.css-11t3bx0,[data-css-11t3bx0]{color:red;}.css-11t3bx0:hover,[data-css-11t3bx0]:hover{color:blue;}')    
  })

  it('can generate html attributes from rules', () => {
    cssLabels(false)
    let red = style({ color: 'red' }),
      blue = hover({ color: 'blue' }),
      merged = compose(red, blue)

    expect(attribsFor(red, merged)).toEqual('data-css-1ezp9xe="" data-css-11t3bx0=""')    
    cssLabels(true)
  })

  it('can extract an id from a rule', () => {
    let red = style({ color: 'red' })

    expect(idFor(red)).toEqual('1ezp9xe')      
  })

  it('checks for a cache miss', () => {
    const myObscureStyle = { 'data-css-obscureclass': '"*"' }

    expect(() => merge(myObscureStyle)).toThrow('[glamor] an unexpected rule cache miss occurred. This is probably a sign of multiple glamor instances in your app. See https://github.com/threepointone/glamor/issues/79')
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
})

describe('empty styles', () => {  
  afterEach(flush)
  
  const shouldIgnore = (method, ...args) => {
    it(`${method.name} ignores empty styles`, () => {
      expect(method(...args)).toEqual({})
      expect(styleSheet.rules().length).toEqual(0)
    })
  }
  
  shouldIgnore(style, {})
  shouldIgnore(select, ' a', {})
  shouldIgnore(parent, '', {})
  shouldIgnore(merge)
  shouldIgnore(merge, {})
  shouldIgnore(media, '()')
  shouldIgnore(media, '()', {})
    
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
    
    check(style, 
     [ { fontSize: 10, color: falsy } ],
     [ { fontSize: 10 } ]
    )
    check(select,
      [ '', { fontSize: 10, color: falsy } ],
      [ '', { fontSize: 10 } ]
    )
    check(
      parent,
      [ '', { fontSize: 10, color: falsy } ],
      [ '', { fontSize: 10 } ]
    )
    check(merge,
      [ { fontSize: 10 }, falsy ],
      [ { fontSize: 10 } ]
    )
    check(media,
      [ '()', { fontSize: 10, color: falsy } ],
      [ '()', { fontSize: 10 } ]
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

    style({ color: 'red' })
    style({ color: 'blue' })
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
  })
  
  it('can add css', () => {
    
    sheet.insert('#box { color: red; }')
    let node = document.createElement('div')
    document.body.appendChild(node)
    node.innerHTML = '<div id="box"/>'
    expect (window.getComputedStyle(node.childNodes[0]).color).toEqual('rgb(255, 0, 0)')
    document.body.removeChild(node)
    
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

describe('react', () => {
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

  it('dom elements accept css prop')
  it('can use vars to set/unset values vertically on the dom-tree')
  it('can use themes to compose styles vertically on  the dom-tree')

  it('propMerge will merge styles with react props', () => {
    // the order of the styles matter here
    // thats how css works :/
    const specificStyle = style({ height: '100px' })
    const defaultStyle = style({ height: '200px' })
    const dummyStyle = style({ color: 'green' })

    let DefaultContainer = (props) => <div {...propMerge(defaultStyle, props)}/>
    let SpecificContainer = (props) => <DefaultContainer {...specificStyle} {...props}/>

    render(<SpecificContainer/>, node, () => {
      expect(childStyle(node).height).toEqual('100px')
    })

    // this would only work properly if we use propMerge also on <SpecificContainer/> definition
    render(<SpecificContainer {...dummyStyle}/>, node, () => {
      expect(childStyle(node).height).toEqual('200px')
    })
  })
})

describe('aphrodite', () => {
  it('takes an aphrodite stylesheet and applies it onto a dom')
})

describe('jsxstyle', () => {
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

  it('exposes a View component', () => {
    render(<View color="red"
      backgroundColor="#ccc"
      hover={{ color: 'blue' }} 
      select={[ ' li', { textDecoration: 'underline' } ]}
      media={[ presets.mobile, { color: 'green' } ]}
      style={{ outline: '1px solid black' }}
      className="myView"
      onClick={() => console.log('whutwhut')} // eslint-disable-line no-console

    />, node, () => {      
      expect(styleSheet.inserted).toEqual({ '1v0yc9d': true, '1v1ok9d': true, 'o6qtyr': true, 'r1q63t': true })
    })
  })
})

import { _css } from '../src/css/raw'
describe('css', () => {
  // how to test the plugin?
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
  it('can parse some css and return a rule', () => {
    // css` color: red `
    let red = 'red'
    let rule = _css`       
      color: yellow; /* 'real' css syntax */
      font-weight: bold;
      /* pseudo classes */  
      :hover {
        /* just javascript */
        color: ${ red };
      }
      
      /* contextual selectors */
      & > h1 { color: purple }  
      html.ie9 & span { padding: 300px }
      & [type='checked'] { border: 1px dashed black }
      
      /* compose with objects */
      ${{ color: 'red' }}
      
      /* or more rules */
      ${ _css`color: greenish` }
      
      /* media queries */
      @media (min-width: 300px) {
        color: orange;
        border: 1px solid blue;
        ${{ color: 'brown' }}
        /* increase specificity */
        && {
          color: blue;
          ${{ color: 'browner' }}
        }
      }
    `
    expect(rule).toEqual([
      { 'color': 'yellow' },
      { 'fontWeight': 'bold' },
      { ':hover': { 'color': 'red' } },
      { '&>h1': { 'color': 'purple' } },
      { 'html.ie9 & span': { 'padding': '300px' } },
      { '& [type=checked]': { 'border': '1px dashed black' } },
      [ { 'color': 'red' } ],
      [ [ { color: 'greenish' } ] ],
      { '@media (min-width:300px)': [
        { 'color': 'orange' },
        { 'border': '1px solid blue' },
        [ { 'color': 'brown' } ],
        { '&&': { 'color': 'browner' } } 
      ] }
    ])
    
  })
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
