import React from 'react'

import { css } from 'glamor'


let styles = {
  blue: {
    color: 'blue'
  },
  red: {
    color: 'red'
  }, 
  green: {
    color: 'green'
  }
}

let mix = css(styles.red, styles.blue, styles.green, styles.red)
let redder = css(styles.red, styles.blue, styles.green, styles.red)

export class App extends React.Component {
  render() {
    return <div {...redder}>what now</div>
  }
}
