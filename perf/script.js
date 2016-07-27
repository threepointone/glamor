/* eslint-disable no-console */

import React from 'react'
import { render } from 'react-dom'


console.log('here')
import { style, speedy } from '../src'

speedy(true)

function times(n, fn) {
  for(let i = 0; i < n; i++) {
    fn(i)
  }
}


// document.getElementById('root').onclick = () => {
//   console.profile()
//   times(1000, () => style({ width: Math.random()*100 }))
//   console.profileEnd()  
// }

let arr = Array.from({ length: 10000 })

function makeRandomColor(){
  return '#'+Math.random().toString(16).substr(-6);
}
 

class App extends React.Component {
  render() {
    return <div>
      {arr.map(x => <div {...style({ width: 100, height: 100, float: 'left', backgroundColor: makeRandomColor() })}>{x}</div>)}            
    </div>
  }
}

console.profile()
render(<App/>, document.getElementById('root'), () => {
  console.profileEnd()
})
