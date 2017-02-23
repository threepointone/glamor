import { View } from '../src'
import { render, unmountComponentAtNode } from 'react-dom'
import { flush, presets, styleSheet } from 'glamor';
import React from 'react';
import expect from 'expect'

describe('glamor-jsxstyle', () => {
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
               media={[ '(min-width: 400px)', { color: 'green' } ]}
               style={{ outline: '1px solid black' }}
               className="myView"
               onClick={() => console.log('whutwhut')} // eslint-disable-line no-console

             />, node, () => {
               expect(styleSheet.inserted).toEqual({ '1v0yc9d': true, '1v1ok9d': true, 'o6qtyr': true, 'r1q63t': true })
             })
    })
})
