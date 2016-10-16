import React from 'react'
import { style, speedy } from '../src'
speedy(true)

function getRandomColor() {
  let letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export class App extends React.Component {
  render() {
    return <div onClick={this.toggle}>
      <Runner count={10000} />
    </div>
  }
}

export class Runner extends React.Component {
  static defaultProps = { count: 100 }
  state = { time: -1 }
  componentWillMount() {
    console.profile()
    let start = Date.now()    
    for(let i = 0; i < this.props.count; i++) {
      style({ 
        color: getRandomColor()        
      })
    }    
    console.profileEnd()
    this.setState({
      time: Date.now() - start
    })
  }
  componentWillUnmount() {
  }
  render() {
    return <div>      
      time taken: {this.state.time}  
    </div>
  }
}
