import React from 'react'

import { css } from 'glamor'

let cls = css({ color: 'red', label: 'reddish' })

export class App extends React.Component {
  render() {
    return <div className={cls}>what now</div>
  }
}
