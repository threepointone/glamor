import React from 'react'
// import { media, merge, hover, style, build } from '../src'
import { css } from '../src'

function log() {
  console.log(this)
  return this
}

let complex = css({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  height: '46px',
  padding: '0.625em',
  boxSizing: 'border-box',
  backgroundColor: 'rgba(255,255,255, 0.97)',
  boxShadow: '0px 0px 20px 0px transparent',
  transition: 'box-shadow .5s ease-in-out'
})

// let error = css({
//   color: 'red',
//   label: 'error'
// })

// let big = css({
//   fontSize: '20',
//   label: 'big'
// })

// let hoverBig = css(error, {
//   ':hover': big
// })

export class App extends React.Component {
  render() {
    return <div {...complex}> hello world </div>
  }
}


// build({}, { src: {
//   color: 'red',
//   ':hover': { color: 'blue', 
//     ':active': { color: 'green' } },
//   '@media (min-width:300px)': {
//     color: 'yellow',
//     ':hover': { color: 'papayawhip' }
//   }
// } })::log()
