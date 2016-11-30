import React from 'react'
import { style, hover } from '../src'


let hoverBlue = style({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  height: '46px',
  padding: '0.625em',
  boxSizing: 'border-box',
  backgroundColor: 'rgba(255,255,255, 0.97)',
  boxShadow: '0px 0px 20px 0px transparent',
  transition: 'box-shadow .5s ease-in-out'
})
export function App() {
  return (
    <div {...hoverBlue}>
      hello!
    </div>
  )
}
