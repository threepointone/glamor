import React from 'react'

import { css } from 'glamor'

let cls = css({ color: 'red', ':after': { content: '" " url(something.jpg)'} })

export class App extends React.Component {
  render() {
    return <div className={cls}>what now</div>
  }
}
