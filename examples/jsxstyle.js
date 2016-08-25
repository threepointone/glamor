import React from 'react'
import { View, Row, Column } from '../src/jsxstyle'

export class App extends React.Component {
  render() {
    return <div>
      <Row>
        <Column>
          some text  
        </Column>
        <Column>
          some text  
        </Column>        
      </Row>
    </div>
  }
}
