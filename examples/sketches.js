import React from 'react'

import { css } from 'glamor'

let cls = css({ color: 'red', '& :matches(h1, h2, h3)': { color: 'green'} })

export class App extends React.Component {
  render() {
    return <div className={cls}>what now</div>
  }
}
