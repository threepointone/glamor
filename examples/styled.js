import React from 'react'
import { styled } from '../new/styled'


let Myd = styled.span`
  color: ${ props => props.color || 'red' }
`

export class App extends React.Component {
  render() {
    return <Myd color='blue'>hello world</Myd>
  }
}
