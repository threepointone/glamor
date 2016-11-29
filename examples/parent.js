import React from 'react'
import { css, parent } from 'glamor'

const styles = {
  root: css({
    backgroundColor: '#fff',
    ':hover': {
      backgroundColor: '#000'
    }
  }),
  child: css(
    {
      color: '#000'
    },
    parent(':hover >', { color: '#fff' })
  )
}


export function App() {
  return (
    <div {...styles.root}>
      <div {...styles.child}>Hover me</div>
    </div>
  )
}
