import React from 'react'

import { style, hover } from '../../src'

let red = style({ backgroundColor: 'red' }),
  blue = style({ backgroundColor: 'blue' })


export class App extends React.Component {
  render() {
    return <div>
      This here is a link to
      <div  {...red} {...blue} >sadasdasd</div>
      <a href='google.com'
        {...hover({ backgroundColor: 'red' })}
        // {...simulate('hover')}
      > google.com
      </a>
    </div>
  }
}
