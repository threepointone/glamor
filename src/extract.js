import React from 'react'

// open file 
// find components 
// try to renderStatic/renderStaticOptimized 
// collect css, output it 

import { renderStaticOptimized } from './server'
import { renderToStaticMarkup } from 'react-dom/server'

let El = require(process.argv[2])
El = El.default || El
El = El.App || El

// 

let { html, css, ids, rules } = renderStaticOptimized(() =>
  renderToStaticMarkup( typeof El === 'function' ? <El/> : El)) // or `renderToStaticMarkup`

console.log({ html, css, ids, rules })