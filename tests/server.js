import { style, merge, hover, flush,
  cssLabels, simulations } from '../src'
import { renderStatic, renderStaticOptimized } from '../src/server'
import jade from 'jade'

import expect from 'expect'
import React from 'react' // eslint-disable-line

import { renderToStaticMarkup } from 'react-dom/server'

// make a throwaway style
style({ color: 'wheat' })

// basic 
{
  cssLabels(false)
  simulations(false)
  let { html, css, ids } = renderStatic(()=>
    renderToStaticMarkup(<div {...style({ color: 'red' })}/>))

  expect(html).toEqual('<div data-css-16y7vsu=""></div>')
  expect(css).toEqual('[data-css-ruiioi]{ color:wheat; } \n[data-css-16y7vsu]{ color:red; } ')
  expect(ids).toEqual([ 'ruiioi', '16y7vsu' ])
  cssLabels(true)
  simulations(true)
}

// optimized 
{
  cssLabels(false)
  simulations(false)
  let { html, css, ids } = renderStaticOptimized(() =>
    renderToStaticMarkup(<div {...merge(style({ color: 'red' }), hover({ color: 'blue' }))}/>))

  expect(html).toEqual('<div data-css-1exzfjk=""></div>')
  expect(css).toEqual('[data-css-1exzfjk]{ color:red; } \n[data-css-1exzfjk]:hover:nth-child(n){ color:blue; } \n')
  expect(ids).toEqual([ '1exzfjk' ])
  cssLabels(true)
  simulations(true)
}

flush()


// jade
{
  let { html, css } = renderStatic(() => {
    return jade.render(`
div&attributes(style({ color: 'blue' }))
  | yay!
`, { style })
  })
  expect(html).toEqual('<div data-css-po2wuq="">yay!</div>')
  expect(css).toEqual('[data-css-po2wuq]{ color:blue; } ')
}
