/* global describe, it, beforeEach, afterEach */
import 'babel-polyfill'
let isPhantom = navigator.userAgent.match(/Phantom/)

import expect from 'expect'
import expectJSX from 'expect-jsx'

expect.extend(expectJSX)

import React from 'react' //eslint-disable-line
import { render, unmountComponentAtNode } from 'react-dom'

import { style, hover, nthChild, firstLetter, media, merge, compose,  select, visited, 
  parent,
  fontFace, keyframes,
  cssLabels,
  simulations, simulate,
  cssFor, attribsFor, idFor,
  presets,
  flush, styleSheet, rehydrate }
from '../src'

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
    expect(el).toEqual(<div data-css-1j3zyhl=""/>)
    render(el, node, () => {
      expect(childStyle(node).backgroundColor).toEqual('rgb(0, 255, 0)')
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

    // todo
    // 3. merge(...styles)
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
        expect(styleSheet.rules().length).toEqual(2)

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
      expect(styleSheet.inserted).toEqual({ '28rtqh': true })
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
        .toEqual('[data-css-1gza2g7]::first-letter { color: red; }')
    })
  }) // how do I test this?

  
  it('can style media queries', () => {
    // we assume phantomjs/chrome/whatever has a width > 300px
    render(<div {...media('(min-width: 300px)', style({ color: 'red' }))}/>, node, () => {
      expect(childStyle(node).color).toEqual('rgb(255, 0, 0)')
      expect(styleSheet.rules()[1].cssText.replace(/\s/g,'').replace('alland', '')) // ie quirk
        .toEqual('@media(min-width:300px){[data-css-18m9kj]{color:red;}}'.replace(/\s/g,''))
        // ugh
    })

  })

  it('can target pseudo classes/elements inside media queries', () => {
    simulations(true)
    render(<div {...media('(min-width: 300px)', hover({ color: 'red' }))} {...simulate('hover')}/>, node, () => {
      expect(childStyle(node).color).toEqual('rgb(255, 0, 0)')
      expect(styleSheet.inserted).toEqual({ '18lme2n': true, '28rtqh': true })
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
    
    expect(el).toEqual(<div data-css-dysmjn="[[red + blue] + :* + {:}]">
      <ul data-css-36ngum="mylist">
        <li data-css-12ttild=":*">one</li>
        <li >two</li>
        <li data-css-1oj4iwd="*mq([red + blue])">three</li>
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
          .toEqual('[data-css-1roj518] { color: red; -webkit-transition: width 2s; transition: width 2s; }')
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

      let f = fontFace(latin)
      expect(styleSheet.rules()[0].cssText.replace(/\s/g,''))
        .toEqual("@font-face { font-family: 'Open Sans'; font-style: normal; font-weight: 400; src: local(Open Sans), local(OpenSans), url(https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3ZBw1xU1rKptJj_0jans920.woff2) format(woff2); }".replace(/\s/g,''))
      expect(f).toEqual('Open Sans')

    })

    it('can add animation keyframes', () => {
      let animate = keyframes('bounce', {
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

    expect(cssFor(red, merged)
      .replace(':nth-child(1n)', ':nth-child(n)')) // dumb chrome 
    .toEqual('[data-css-im3wl1] { color:red; }\n[data-css-1lci705] { color:red; }\n[data-css-1lci705]:hover:nth-child(n) { color:blue; }')
  })

  it('can generate html attributes from rules', () => {
    cssLabels(false)
    let red = style({ color: 'red' }),
      blue = hover({ color: 'blue' }),
      merged = compose(red, blue)

    expect(attribsFor(red, merged)).toEqual('data-css-im3wl1="" data-css-1lci705=""')    
    cssLabels(true)
  })

  it('can extract an id from a rule', () => {
    let red = style({ color: 'red' })

    expect(idFor(red)).toEqual('im3wl1')      
  })


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
      styleTag.styleSheet.cssText += '[data-css-im3wl1]{ color:red; }'
    } else {
      styleTag.appendChild(document.createTextNode('[data-css-im3wl1]{ color:red; }'))
    }
    document.head.appendChild(styleTag)
    node.innerHTML = '<div data-css-im3wl1=""></div>'
    expect(childStyle(node).color).toEqual('rgb(255, 0, 0)')
    rehydrate([ 'im3wl1' ])

    style({ color: 'red' })
    style({ color: 'blue' })

    expect(styleSheet.rules().length).toEqual(1)
    document.head.removeChild(styleTag)

  })

})

import { StyleSheet } from '../src/sheet'

describe('StyleSheet', () => {
  it('can initialize', () => {
    let sheet = new StyleSheet()
    sheet.inject()
    expect([ ...document.styleSheets ].filter(s => s.ownerNode === sheet.tags[0]).length).toEqual(1)
    sheet.flush()
  })
  
  it('can add css', () => {
    let sheet = new StyleSheet()
    sheet.inject()
    sheet.insert('#box { color: red; }')
    let node = document.createElement('div')
    document.body.appendChild(node)
    node.innerHTML = '<div id="box"/>'
    expect (window.getComputedStyle(node.childNodes[0]).color).toEqual('rgb(255, 0, 0)')
    document.body.removeChild(node)
    sheet.flush()
  })
  
  it('can flush all the css', () => {
    let sheet = new StyleSheet()
    sheet.inject()
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
  it('dom elements accept css prop')
  it('can use vars to set/unset values vertically on the dom-tree')
  it('can use themes to compose styles vertically on  the dom-tree')  
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
      expect(styleSheet.inserted).toEqual({ '10yhhz1': true, '13imxhw': true, '1jtt596': true, '1rhjrui': true })
    })
  })
})


// a useful utility for quickly tapping objects. use with the :: operator 
// {x: 1}::log()
// [5, 12, 90]::log().filter(x => x%5)::log()
export function log(msg) { //eslint-disable-line no-unused-vars
  console.log(msg || this) //eslint-disable-line no-console
  return this
}
