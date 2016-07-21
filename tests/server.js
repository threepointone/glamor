import { style, renderStatic, renderStaticOptimized } from '../src'

import expect from 'expect'
import React from 'react' // eslint-disable-line

import { renderToStaticMarkup } from 'react-dom/server'


// make a throwaway style
style({ color: 'wheat' })


{
  let { html, css, cache } = renderStatic(()=>
    renderToStaticMarkup(<div {...style({ color: 'red' })}/>))

  expect(html).toEqual('<div data-css-_="16y7vsu"></div>')
  expect(css).toEqual('[data-css-_="ruiioi"]{ color:wheat; } \n[data-css-_="16y7vsu"]{ color:red; } ')
  expect(cache).toEqual({ '16y7vsu': { id: '16y7vsu', style: { color: 'red' }, type: '_' }, ruiioi: { id: 'ruiioi', style: { color: 'wheat' }, type: '_' } })
}

// todo - optimized css
{
  let { html, css, cache } = renderStaticOptimized(() =>
    renderToStaticMarkup(<div {...style({ color: 'red' })}/>))

  expect(html).toEqual('<div data-css-_="16y7vsu"></div>')
  expect(css).toEqual('[data-css-_="16y7vsu"]{ color:red; } ')
  expect(cache).toEqual({ '16y7vsu': { type: '_', style: { color: 'red' }, id: '16y7vsu' } })

}
