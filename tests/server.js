import { style, css, hover, flush, styleSheet,
  cssLabels, simulations } from '../src'
import { renderStatic, renderStaticOptimized } from '../src/server'

import expect from 'expect'
import React from 'react' // eslint-disable-line

import { renderToStaticMarkup } from 'react-dom/server'

// make a throwaway style
css.global('html, body', {
  padding: 20
})
css({ color: 'wheat' })

// basic 
{
  let { html, css, ids } = renderStatic(()=>
    renderToStaticMarkup(<div {...style({ color: 'red' })}/>))

  expect(html).toEqual('<div data-css-1ezp9xe=""></div>')
  expect(css).toEqual('html, body{padding:20px;}.css-17kdler,[data-css-17kdler]{color:wheat;}.css-1ezp9xe,[data-css-1ezp9xe]{color:red;}')
  expect(ids).toEqual([ 'afsnj3', '17kdler', '1ezp9xe' ])
  cssLabels(true)
  simulations(true)
}

// optimized 
{
  cssLabels(false)
  simulations(false)
  let { html, css, ids } = renderStaticOptimized(() =>
    renderToStaticMarkup(<div {...style(style({ color: 'red' }), hover({ color: 'blue' }))}/>))
  expect(html).toEqual('<div data-css-11t3bx0=""></div>')
  expect(css).toEqual('html, body{padding:20px;}.css-11t3bx0,[data-css-11t3bx0]{color:red;}.css-11t3bx0:hover,[data-css-11t3bx0]:hover{color:blue;}')
  expect(ids).toEqual([ 'afsnj3', '11t3bx0' ])
  cssLabels(true)
  simulations(true)
}

flush()
