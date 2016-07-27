// /* eslint-disable no-console */

// import React from 'react'
// import { render } from 'react-dom'


// console.log('here')
// import { style, speedy } from '../src'

// speedy(true)

// function times(n, fn) {
//   for(let i = 0; i < n; i++) {
//     fn(i)
//   }
// }


// // document.getElementById('root').onclick = () => {
// //   console.profile()
// //   times(1000, () => style({ width: Math.random()*100 }))
// //   console.profileEnd()  
// // }

// let arr = Array.from({ length: 10000 })

function makeRandomColor(){
  return '#'+Math.random().toString(16).substr(-6);
}
 

// class App extends React.Component {
//   render() {
//     return <div>
//       {arr.map(x => <div {...style({ width: 100, height: 100, float: 'left', backgroundColor: makeRandomColor() })}>{x}</div>)}            
//     </div>
//   }
// }

// console.profile()
// render(<App/>, document.getElementById('root'), () => {
//   console.profileEnd()
// })

// this time, we're going to hold an array of rules 
// corresponding to an array of elements 

// and then we're going to set all of them at once. 

let arr = Array.from({ length: 30000 })
arr.forEach((_, x) => {
  let el = document.createElement('div')
  el.id = 'el-' + x
  document.getElementById('root').appendChild(el)
})

console.profile()
arr.forEach((_, x) => document.getElementById('el-' + x).style.backgroundColor = makeRandomColor())
console.profileEnd()

// let styleTag = document.createElement('style')
// styleTag.id = styleTag.id || '_css_'
// styleTag.appendChild(document.createTextNode(''));
// (document.head || document.getElementsByTagName('head')[0]).appendChild(styleTag)
// let styleSheet = [ ...document.styleSheets ].filter(x => x.ownerNode === styleTag)[0]  


// let arr = Array.from({ length: 10000 })
// arr.forEach((_, x) => {
//   let el = document.createElement('div')
//   el.id = 'el-' + x
//   document.getElementById('root').appendChild(el)
// })

// console.profile()
// arr.forEach((_, x) => {
//   styleSheet.insertRule(`#el-${x} { background-color: ${makeRandomColor()}; }`, styleSheet.cssRules.length)
// })
// console.profileEnd()

// now the same, but batch it 
// let styleTag = document.createElement('style')
// styleTag.id = styleTag.id || '_css_'
// styleTag.appendChild(document.createTextNode(''));
// (document.head || document.getElementsByTagName('head')[0]).appendChild(styleTag)
// let styleSheet = [ ...document.styleSheets ].filter(x => x.ownerNode === styleTag)[0]  


// let arr = Array.from({ length: 30000 })
// arr.forEach((_, x) => {
//   let el = document.createElement('div')
//   el.id = 'el-' + x
//   document.getElementById('root').appendChild(el)
// })

// let css = ''
// arr.forEach((_, x) => {
//   css+= `#el-${x} { background-color: ${makeRandomColor()}; }\n`
// })
// console.profile()
// styleSheet.insertRule(`@media all { ${css} }`, styleSheet.cssRules.length)
// console.profileEnd()

