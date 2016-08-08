import React from 'react'

import { base } from '../src/ous'
import { style, merge } from '../src'

function log() {
  console.log(this) // eslint-disable-line
  return this
}


export class App extends React.Component {
  render() {
    return <div {...base}>      
      hello! 
      <Grid/>     
    </div>
  }
}


import { container, row, columns, half, oneThird, twoThirds } from '../src/ous'

let grayBg = style({ backgroundColor: '#eee', textAlign: 'center', borderRadius: 4 })

let grayCols = n => merge(columns(n), grayBg)

class Grid extends React.Component {
  render() {
    // 'container' is main centered wrapper
    return <div {...container} >
      {/* columns should be the immediate child of a .row */}
      <div {...row}>
        <div {...columns(1)}> One </div>
        <div {...columns(11)}> Eleven </div>
      </div>
      
      <div {...row}>
        <div {...columns(2)}> Two </div>
        <div {...columns(10)}> Ten </div>
      </div>

      <div {...row}>
        <div {...grayCols(3)}> Three </div>
        <div {...grayCols(9)}> Nine </div>
      </div>

      <div {...row}>
        <div {...grayCols(4)}> Four </div>
        <div {...grayCols(8)}> Eight </div>
      </div>
    {/* shothand for half and thirds */}
      <div {...row}>
        <div {...oneThird()}> 1/3 </div>
        <div {...twoThirds()}> 2/3 </div>
      </div>      

      <div {...row}>
        <div {...half()}> 1/2 </div>
        <div {...half()}> 1/2 </div>
      </div> 
    </div>
  }
}


