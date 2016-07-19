import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import { style, hover, nthChild, firstLetter, media, startSimulation, stopSimulation, simulate, rehydrate, flush } from 'src/'

function childStyle(node, p = null){
  return window.getComputedStyle(node.childNodes[0], p)
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
    render(<div {...style({ backgroundColor: '#0f0'})}></div>, node, () => {
      expect(node.innerHTML).toEqual('<div data-reactroot="" data-css-_="1ipahuh"></div>')
      expect(childStyle(node).backgroundColor).toEqual('rgb(0, 255, 0)')
    })
  })

  it('multiple styles can be combined', () => {
    render(<div {...style({width: 100, height: 200 })} {...style({ height: 100 })} />, node, () => {
      expect(childStyle(node).height).toEqual('100px')
    })
  })

  it('reuses common styles', () => {
    render(<div>
        <div {...style({backgroundColor: 'blue'})}></div>
        <div {...style({backgroundColor: 'red'})}></div>
        <div {...style({backgroundColor: 'blue'})}></div>
      </div>, node, () => {

        // only 2 rules get added to the stylesheet
        expect(document.styleSheets._css_.rules.length).toEqual(2)

        let [id0, id1, id2] = [0, 1, 2].map(i => node.childNodes[0].childNodes[i].getAttribute('data-css-_'))
        expect(id0).toEqual(id2) // first and third elements have the same hash
        expect(id0).toNotEqual(id1)   // not the second
      })
  })

  it('doesn\'t touch style/className, respects precedence', () => {
    render(<div {...style({color: 'red'})} className='whatever' style={{color: 'blue'}}/>, node, () => {
      expect(childStyle(node).color).toEqual('rgb(0, 0, 255)')
      expect([...node.childNodes[0].classList]).toEqual(['whatever'])
    })
  })

  it('can style pseudo classes', () => {
    render(<div {...hover({color: 'red'})}/>, node, () => {
      // console.log(childStyle(node, ':hover').getPropertyValue('color'))
      // ^ this doesn't work as I want
      expect(document.styleSheets._css_.rules[0].cssText)
        .toEqual('[data-css-hover="1w84cbc"]:hover { color: red; }')
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
    let obj = nthChild(2, {color: 'red'})
    render(<div>
        <div {...obj} />
        <div {...obj} />
        <div {...obj} />
        <div {...obj} />
      </div>, node, () => {
        expect([0, 1, 2, 3].map(i => parseInt(window.getComputedStyle(node.childNodes[0].childNodes[i]).color.slice(4), 10)))
          .toEqual([0, 255, 0, 0])
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
    render(<div {...firstLetter({color:'red'})} />, node, () => {
      expect(document.styleSheets._css_.rules[0].cssText)
        .toEqual('[data-css-firstLetter="19rst82"]::first-letter { color: red; }')
    })
  }) // how do I test this?

  it('can style media queries', () => {
    // we assume phantomjs/chrome/whatever has a width > 300px
    render(<div {...media('(min-width: 300px)', {color: 'red'})}/>, node, () => {
      expect(childStyle(node).color).toEqual('rgb(255, 0, 0)')
      expect(document.styleSheets._css_.rules[0].cssText)
        .toEqual('@media (min-width: 300px) { \n  [data-css-_="jmjadz"] { color: red; }\n}')
        // ugh
    })

  })

  it('can target pseudo classes/elements inside media queries', () => {
    startSimulation()
    render(<div {...media('(min-width: 300px)', hover({color: 'red'}))} {...simulate('hover')}/>, node, () => {
      expect(childStyle(node).color).toEqual('rgb(255, 0, 0)')
      expect(document.styleSheets._css_.rules[1].cssText)
        .toEqual('@media (min-width: 300px) { \n  [data-css-hover="5o4wo0"]:hover, [data-css-hover="5o4wo0"][data-simulate-hover] { color: red; }\n}')
      // ugh
      stopSimulation()
    })


  })

  it('can simulate media queries')

  it('server side rendering', () => {
    // see tests/server.js
  })

  it('can rehydrate from serialized css/cache data', () => {
    let styleTag = document.createElement('style')
    if (styleTag.styleSheet) {
        styleTag.styleSheet.cssText += '[data-css-_="16y7vsu"]{ color:red;}';
    } else {
        styleTag.appendChild(document.createTextNode('[data-css-_="16y7vsu"]{ color:red;}'));
    }
    document.head.appendChild(styleTag)
    node.innerHTML = '<div data-css-_="16y7vsu"></div>'
    expect(childStyle(node).color).toEqual('rgb(255, 0, 0)')
    rehydrate({ '16y7vsu': { id: '16y7vsu', style: { color: 'red' }, type: '_' }})
    // then call style() with the same value and make sure it doesn't get overwritten

    // expect(document.styleSheets._css_.rules.length).toEqual(1)
    //
    // expect(document.styleSheets._css_.rules.length).toEqual(1)
    style({color: 'red'})
    style({color: 'blue'})

    expect(document.styleSheets._css_.rules.length).toEqual(1)


    // tag.innerText = ''

  })

  it('delete a rule from the stylesheet')


})
