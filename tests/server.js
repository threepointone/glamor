import { style, merge, hover, flush,
  renderStatic, renderStaticOptimized } from '../src'
import jade from 'jade'

import expect from 'expect'
import React from 'react' // eslint-disable-line

import { renderToStaticMarkup } from 'react-dom/server'


// make a throwaway style
style({ color: 'wheat' })


{
  let { html, css, cache } = renderStatic(()=>
    renderToStaticMarkup(<div {...style({ color: 'red' })}/>))

  expect(html).toEqual('<div data-css-16y7vsu=""></div>')
  expect(css).toEqual('[data-css-ruiioi]{ color:wheat; } \n[data-css-16y7vsu]{ color:red; } ')
  expect(cache).toEqual({
    '16y7vsu': { id: '16y7vsu', style: { color: 'red' }, type: '_' },
    ruiioi: { id: 'ruiioi', style: { color: 'wheat' }, type: '_' }
  })
}

{
  let { html, css, cache } = renderStaticOptimized(() =>
    renderToStaticMarkup(<div {...merge(style({ color: 'red' }), hover({ color: 'blue' }))}/>))

  expect(html).toEqual('<div data-css-x8bs5u=""></div>')
  expect(css).toEqual('[data-css-x8bs5u]{ color:red; } \n[data-css-x8bs5u]:hover{ color:blue; } \n')
  expect(cache).toEqual({
    x8bs5u: { bag: { _: { color: 'red' }, hover: { color: 'blue' } }, id: 'x8bs5u', label: '' }
  })
}

flush()

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
