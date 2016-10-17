// string literal 
// styled.tag
// styled(Component)
import React from 'react'
import { merge, style } from '../src'
export function styled(Component, obj) {
  return class StyledComponent extends React.Component {
    render() {
      let { css, ...props } = this.props
      return <Component {...props} {...this.props.css ? merge(obj, css) : style(obj)}/> // todo - isLikeRule 
    }
  }
}
