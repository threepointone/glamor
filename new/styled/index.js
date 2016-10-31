import React from 'react'
import { merge, style } from '../../src'

import { parser, convert } from '../../src/css'
let __val__ = (x, props) => typeof x === 'function' ? x(props) : x

export function styled(Component, obj) {
  if(obj) {
    // transpiled, and / or by hand 
    return class StyledComponent extends React.Component {
      render() {
        let { css, ...props } = this.props
        let orig_css = typeof obj === 'function' ? obj(__val__, this.props) : obj
        
        return <Component {...props} {...this.props.css ? merge(orig_css, css) : style(orig_css)}/> // todo - isLikeRule 
      }
    }  
  }
  return function (strings, ...values) {
    // in-browser parsing
    let { parsed, stubs } = parser(strings, ...values)
    return class StyledComponent extends React.Component {
      render() {
        let { className = '', css, ...props } = this.props
        return <Component className={className + ' ' + merge(convert(parsed, { stubs, args: [ this.props ] }), css || {})} {...props} />
      }
    }
  }
}
