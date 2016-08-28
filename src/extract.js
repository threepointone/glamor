import React from 'react'

// open file 
// find components 
// try to renderStatic/renderStaticOptimized 
// collect css, output it 

import { renderStaticOptimized } from './server'
import { renderToStaticMarkup } from 'react-dom/server'

let argv = require('minimist')(process.argv.slice(2))

let El = require(argv.src)
El = El.default || El
El = El.App || El

// 

let { html, css, ids, rules } = renderStaticOptimized(() =>
  renderToStaticMarkup( typeof El === 'function' ? <El/> : El)) // or `renderToStaticMarkup`

console.log({ html, css, ids, rules })