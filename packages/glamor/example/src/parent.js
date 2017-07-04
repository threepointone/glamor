import React from 'react'
import { css } from 'glamor'

const styles = {
  root: css({
    backgroundColor: '#fff',
    ':hover': {
      backgroundColor: '#000'
    }
  }),
  child: css(
    {
      color: '#000',
      [`:hover > &`]: { color: '#fff' }
    }
  )
}


export function App() {
  return (
    <div {...styles.root}>
      <div {...styles.child}>Hover me</div>
    </div>
  )
}
