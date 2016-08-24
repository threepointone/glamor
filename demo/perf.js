import React from 'react'
import { StyleSheet } from '../src/sheet'

export class App extends React.Component {
  state = { speedy : true }
  toggle = () => {
    this.setState({ speedy: !this.state.speedy })
  }
  render() {
    return <div onClick={this.toggle}>
      <Runner key={ this.state.speedy ? 1: 0} count={1000} speedy={this.state.speedy}/>
    </div>
  }
}

export class Runner extends React.Component {
  static defaultProps = { count: 100, speedy: true }
  state = { time: -1, sheet: new StyleSheet({ speedy: this.props.speedy }) }
  componentWillMount() {
    this.state.sheet.inject()
    let start = Date.now()
    let c = Math.round(Math.random() * 255)
    c = `rgb(${c}, ${c}, ${c})`
    for(let i=0; i< this.props.count; i++) {
      this.state.sheet.insert(`.cls-${i} { color: ${c} }`)
    }    
    this.setState({
      time: Date.now() - start
    })
  }
  componentWillUnmount() {
    this.state.sheet.flush()
  }
  render() {
    return <div>
      speedy = {this.props.speedy ? 'true' : 'false' } <br/>
      time taken: {this.state.time}  
    </div>
  }
}
