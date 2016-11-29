import React from 'react'
// import { media, merge, hover, style, build } from '../src'
import { css } from '../src'

function log() {
  console.log(this)
  return this
}

let complex = css({
  color: 'red',
  ':hover': {
    color: 'blue'
  },
  '@media(min-width: 300px)': {
    color: 'green',
    ':hover': {
      color: 'yellow'
    },
    '.a & .c': { color: 'wheat' },
    '&&': { color: 'ivory' }
  }
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
