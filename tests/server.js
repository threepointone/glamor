import { style, merge, hover, flush, insertGlobal,
  cssLabels, simulations } from '../src'
import { renderStatic, renderStaticOptimized } from '../src/server'
import jade from 'jade'

import expect from 'expect'
import React from 'react' // eslint-disable-line

import { renderToStaticMarkup } from 'react-dom/server'

// make a throwaway style
insertGlobal('html, body', {
  padding: 20
})
style({ color: 'wheat' })

// basic 
{
  let { html, css, ids } = renderStatic(()=>
    renderToStaticMarkup(<div {...style({ color: 'red' })}/>))

  expect(html).toEqual('<div data-css-im3wl1=""></div>')
  expect(css).toEqual('html, body{padding:20px;}.css-92lrii,[data-css-92lrii]{color:wheat;}.css-im3wl1,[data-css-im3wl1]{color:red;}')
  expect(ids).toEqual([ 'afsnj3', '92lrii', 'im3wl1' ])
  cssLabels(true)
  simulations(true)
}

// optimized 
{
  cssLabels(false)
  simulations(false)
  let { html, css, ids } = renderStaticOptimized(() =>
    renderToStaticMarkup(<div {...merge(style({ color: 'red' }), hover({ color: 'blue' }))}/>))

  expect(html).toEqual('<div data-css-1lci705=""></div>')
  expect(css).toEqual('html, body{padding:20px;}.css-1lci705,[data-css-1lci705]{color:red;}.css-1lci705:hover:nth-child(n),[data-css-1lci705]:hover:nth-child(n){color:blue;}')
  expect(ids).toEqual([ 'afsnj3', '1lci705' ])
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
  expect(html).toEqual('<div data-css-hxfs3d="*">yay!</div>')
  expect(css).toEqual('.css-hxfs3d,[data-css-hxfs3d]{color:blue;}')
}
