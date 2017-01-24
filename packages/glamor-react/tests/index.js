import { propMerge } from '../src'
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom'
import { style, flush } from 'glamor';
import expect from 'expect'

function childStyle(node, p = null) {
  return window.getComputedStyle(node.childNodes[0], p)
}

describe('glamor-react', () => {
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
