import React from 'react'
import { createMarkupForStyles } from 'react/lib/CSSPropertyOperations' // converts a js style object to css markup


import { merge, media, keyframes, select, hover, style, simulate, fontFace, keyed } from '../src'

function log(msg) { //eslint-disable-line no-unused-vars
  console.log(msg || this) //eslint-disable-line no-console
  return this
}



function makeRandomColor() {
  return '#'+Math.random().toString(16).substr(-6)
}

function position(mouse = { pageX: 0, pageY:0 }, i, j) {
  // find offset from 'center'
  // move each i and j a percentage of the way to it 
  
  return {
    top: j * 20 + (mouse.pageY - j * 20)*0.8,
    left: i * 20 + (mouse.pageX - i * 20)*0.8,
    position: 'absolute',
    height: 10,
    width: 10,
    backgroundColor: '#ccc',
    borderRadius: 20
  }
}

function times(n, fn) {
  let arr = []
  for(let i=0; i<n; i++) {
    arr.push(fn(i))
  }
  return arr 
}


// export class App extends React.Component {

//   onMouseMove = e => {
//     times(30, i => {
//       times(30, j => {
//         keyed(`el-${i}-${j}`, position(e, i, j))
//       })
//     })
//   }
//   render() {
//     return <div onMouseMove={this.onMouseMove} {...style({ display: 'block', clear: 'both', width: '100%', height: 400 })}>{
//       times(30, i =>         
//         times(30, j => 
//           <div {...keyed(`el-${i}-${j}`, position(undefined, i, j))}/>
//         )         
//       )
//     }</div>
//   } 
// }


// export class App extends React.Component {
//   state = { e: { pageX: 0, pageY: 0 } }
//   onMouseMove = e => {
//     // console.log('moving', e)
//     this.setState({ pageX:e.pageX, pageY: e.pageY })
//     // times(20, i => {
//     //   times(20, j => {
//     //     keyed(`el-${i}-${j}`, position(e, i, j))
//     //   })
//     // })
//   }
//   render() {

//     return <div onMouseMove={this.onMouseMove} {...style({ display: 'block', clear: 'both', width: '100%', height: 400 })}>{
//       times(20, i =>         
//         times(20, j => 
//           <div style={position(this.state, i, j)}/>
//         )         
//       )
//     }</div>
//   } 
// }


export class App extends React.Component {
  onMouseMove = e => {
    // get all the rules 
    // add one ginat media query 
    let rules = []
    times(40, i => {
      times(40, j => {
        rules.push(`#el-${i}-${j} { ${createMarkupForStyles(position(e, i, j))} }`)
        // keyed(`el-${i}-${j}`, position(e, i, j))
      })
    })
    let sheet = document.styleSheets._css_ || [ ...document.styleSheets ].filter(x => x.ownerNode.id === '_css_')[0]  
    if(sheet.cssRules.length >0) {
      sheet.deleteRule(0)  
    }
    
    sheet.insertRule(`@media all{ ${rules.join('\n')} }`, 0)
  }
  render() {
    return <div style={{ display: 'block', clear: 'both', width: '100%', height: 400 }} onMouseMove={this.onMouseMove} >{
      times(40, i =>         
        times(40, j => 
          <div id={`el-${i}-${j}`}/>
        )         
      )
    }</div>
  } 
}
