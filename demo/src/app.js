import React from 'react'

import { hover } from '../../src'

export class App extends React.Component {
  render() {
    return <div>
      This here is a link to
      <a href='google.com'
        {...hover({ backgroundColor: 'red' })}
        // {...simulate('hover')}
      > google.com
      </a>
    </div>
  }
}
