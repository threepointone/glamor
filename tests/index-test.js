import expect from 'expect'
import React from 'react' //eslint-disable-line
import { render, unmountComponentAtNode } from 'react-dom'

import { style, hover, nthChild, firstLetter, media, merge, multi, select, visited,
  useLabels, noLabels,
  startSimulation, stopSimulation, simulate,
  rehydrate, flush }
from 'src/'

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


describe('react-css', () => {
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
    render(<div {...style({ backgroundColor: '#0f0' })}></div>, node, () => {
      expect(node.innerHTML).toEqual('<div data-reactroot="" data-css-1ipahuh=""></div>')
      expect(childStyle(node).backgroundColor).toEqual('rgb(0, 255, 0)')
    })
  })

  it('correctly handles display:flex', () => {
    render(<div {...style({ display: 'flex' })}/>, node, () => {
      expect(childStyle(node).display).toMatch(/flex/)
    })
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

  it('reuses common styles', () => {
    render(<div>
        <div {...style({ backgroundColor: 'blue' })}></div>
        <div {...style({ backgroundColor: 'red' })}></div>
        <div {...style({ backgroundColor: 'blue' })}></div>
      </div>, node, () => {

        // only 2 rules get added to the stylesheet
        expect(document.styleSheets._css_.rules.length).toEqual(2)

        let [ id0, id1, id2 ] = [ 0, 1, 2 ].map(i => getDataAttributes(node.childNodes[0].childNodes[i]))
        expect(id0).toEqual(id2) // first and third elements have the same hash
        expect(id0).toNotEqual(id1)   // not the second
      })
  })

  it('doesn\'t touch style/className', () => {
    render(<div {...style({ color: 'red' })} className="whatever" style={{ color: 'blue' }}/>, node, () => {
      expect(childStyle(node).color).toEqual('rgb(0, 0, 255)')
      expect([ ...node.childNodes[0].classList ]).toEqual([ 'whatever' ])
    })

  })

  it('can style pseudo classes', () => {
    render(<div {...hover({ color: 'red' })}/>, node, () => {
      // console.log(childStyle(node, ':hover').getPropertyValue('color'))
      // ^ this doesn't work as I want
      expect(document.styleSheets._css_.rules[0].cssText)
        .toEqual('[data-css-1w84cbc]:hover { color: red; }')
        // any ideas on a better test for this?
    })
  })

  it('can simulate pseudo classes', () => {
    // start simulation mode
    startSimulation()
    render(<div {...hover({ backgroundColor: 'rgba(255, 0, 0, 0)' })} {...simulate('hover')}/>, node, () => {
      expect(childStyle(node).backgroundColor).toEqual('rgba(255, 0, 0, 0)')
      // turn it off
      stopSimulation()
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
    startSimulation()
    render(<div
        {...nthChild(2, { backgroundColor: 'rgba(255, 0, 0, 0)' })}
        {...simulate(':nth-child(2)')}
      />, node, () => {
        expect(childStyle(node).backgroundColor).toEqual('rgba(255, 0, 0, 0)')
        stopSimulation()
      })
    // you can use nthChild2 nth-child(2) :nth-child(2), whatever.
    // only if there exists a similar existing rule to match really would it work anyway
  })

  it('can style pseudo elements', () => {
    render(<div {...firstLetter({ color:'red' })} />, node, () => {
      expect(document.styleSheets._css_.rules[0].cssText)
        .toEqual('[data-css-19rst82]::first-letter { color: red; }')
    })
  }) // how do I test this?

  it('can add multiple pseudo classes on the same rule', () => {
    render(<div {...multi('hover:active::after', { color:'red' })} />, node, () => {
      expect(document.styleSheets._css_.rules[0].cssText)
        .toEqual('[data-css-4jjrud]:hover:active::after { color: red; }')
    })
  })

  it('can style media queries', () => {
    // we assume phantomjs/chrome/whatever has a width > 300px
    render(<div {...media('(min-width: 300px)', style({ color: 'red' }))}/>, node, () => {
      expect(childStyle(node).color).toEqual('rgb(255, 0, 0)')
      expect(document.styleSheets._css_.rules[1].cssText)
        .toEqual('@media (min-width: 300px) { \n  [data-css-ajnavo] { color: red; }\n}')
        // ugh
    })

  })

  it('can target pseudo classes/elements inside media queries', () => {
    startSimulation()
    render(<div {...media('(min-width: 300px)', hover({ color: 'red' }))} {...simulate('hover')}/>, node, () => {
      expect(childStyle(node).color).toEqual('rgb(255, 0, 0)')
      expect(document.styleSheets._css_.rules[1].cssText)
        .toEqual('@media (min-width: 300px) { \n  [data-css-5o4wo0]:hover, [data-css-5o4wo0][data-simulate-hover] { color: red; }\n}')
      // ugh
      stopSimulation()
    })


  })

  it('can merge rules', () => {
    startSimulation()
    let blue = style({ backgroundColor: 'blue' }),
      red = style({ backgroundColor: 'red', color: 'yellow' }),
      hoverGn = hover({ color: 'green' })

    render(<div {...merge(red, blue, hoverGn)} />, node, () => {
      expect(childStyle(node).backgroundColor).toEqual('rgb(0, 0, 255)')
    })
    let sheetLength = document.styleSheets._css_.rules.length

    render(<div {...merge(red, blue, hoverGn)} {...simulate('hover')}/>, node, () => {
      expect(childStyle(node).color).toEqual('rgb(0, 128, 0)')
      expect(document.styleSheets._css_.rules.length).toEqual(sheetLength)
    })
    stopSimulation()
  })


  it('adds vendor prefixes', () => {
    render(<div {...style({ color: 'red', transition: 'width 2s' })} />, node, () => {
      expect(document.styleSheets._css_.rules[0].cssText)
        .toEqual('[data-css-10v74ka] { color: red; -webkit-transition: width 2s; transition: width 2s; }')
    })
  })

  it('can simulate media queries')

  it('has an escape hatch', () => {
    render(<div {...select('.item', { color: 'red' }) }>
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
    useLabels()
    let red = style({ label: 'red', color: 'red' }),
      hoverBlue = hover({ label: 'blue', color: 'blue' }),
      text = merge(red, hoverBlue),
      container = merge(text, visited({ fontWeight: 'bold' }),
        { color: 'gray' }),
      mq = media('(min-width: 500px)', text)

    render(<div {...container}>
      <ul {...style({ label: 'mylist' })}>
        <li {...hover({ color: 'green' })}>one</li>
        <li >two</li>
        <li {...mq}>three</li>
      </ul>
    </div>, node, () => {
      expect(node.innerHTML).toEqual('<div data-reactroot="" data-css-959am3="[red + blue:hover] + `szlvmg:visited + {…}"><ul data-css-1oppo9="mylist"><li data-css-qh7ndu=":hover">one</li><li>two</li><li data-css-1nl2w09="*mq [red + blue:hover]">three</li></ul></div>')
      noLabels()
    })
  })
  // plain rules
  // merged rules
  // media query wrap / override?


  it('server side rendering', () => {
    // see tests/server.js
  })

  it('can rehydrate from serialized css/cache data', () => {
    let styleTag = document.createElement('style')
    if (styleTag.styleSheet) {
      styleTag.styleSheet.cssText += '[data-css-_="16y7vsu"]{ color:red; }'
    } else {
      styleTag.appendChild(document.createTextNode('[data-css-_="16y7vsu"]{ color:red; }'))
    }
    document.head.appendChild(styleTag)
    node.innerHTML = '<div data-css-_="16y7vsu"></div>'
    expect(childStyle(node).color).toEqual('rgb(255, 0, 0)')
    rehydrate({ '16y7vsu': { id: '16y7vsu', style: { color: 'red' }, type: '_' } })

    style({ color: 'red' })
    style({ color: 'blue' })

    expect(document.styleSheets._css_.rules.length).toEqual(1)
    document.head.removeChild(styleTag)

  })

  it('delete a rule from the stylesheet')

})
