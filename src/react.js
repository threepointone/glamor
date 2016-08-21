import React from 'react'
import * as glamor from './index'

// import shallowCompare from 'react-addons-shallow-compare'
let withKeys = (...keys) => keys.reduce((o, k) => (o[k] = true, o), {})

let pseudos = withKeys(
  // pseudoclasses
  'active', 'any', 'checked', 'disabled', 'empty', 'enabled', '_default', 'first', 'firstChild', 'firstOfType', 
  'fullscreen', 'focus', 'hover', 'indeterminate', 'inRange', 'invalid', 'lastChild', 'lastOfType', 'left', 
  'link', 'onlyChild', 'onlyOfType', 'optional', 'outOfRange', 'readOnly', 'readWrite', 'required', 'right', 
  'root', 'scope', 'target', 'valid', 'visited',
  // pseudoelements
  'after', 'before', 'firstLetter', 'firstLine', 'selection', 'backdrop', 'placeholder' 
)

let parameterizedPseudos = withKeys(
 'dir', 'lang', 'not', 'nthChild', 'nthLastChild', 'nthLastOfType', 'nthOfType' 
)

const STYLE_PROP_NAMES = Object.keys(document.createElement('div').style).reduce((styles, key) => {
  styles[key] = true
  return styles
}, {})

const splitStyles = (combinedProps) => {
  const props = {}, gStyle = [], style = {}
  Object.keys(combinedProps).forEach((key) => {
    if (STYLE_PROP_NAMES[key])
      style[key] = combinedProps[key]
    else if (pseudos[key] >= 0) {
      gStyle.push(glamor[key](combinedProps[key]))
    }    
    else if (parameterizedPseudos[key] || (key === 'media') || (key === 'select')) {
      gStyle.push(glamor[key](...combinedProps[key]))
    }
    else if((key === 'merge') || (key === 'compose')) {
      if(Array.isArray(combinedProps[key])) {
        gStyle.splice(-1, 0, ...combinedProps[key])
      }
      else {
        gStyle.splice(-1, 0, combinedProps[key])  
      }
    }
    else
      props[key] = combinedProps[key]
  })
  return { ...glamor.style(style), ...gStyle.length > 0 ? glamor.merge(...gStyle) : {}, ...props }
}

export class View extends React.Component {
  static defaultProps = {
    component: 'div'
  }

  render() {
    const { component: Component, ...props } = this.props
    return <Component {...splitStyles(props)} />
  }
}

export class Block extends React.Component {
  render() {
    return <View display="block" {...this.props} />
  }
}

export class InlineBlock extends React.Component {
  render() {
    return <Block display="inline-block" {...this.props} />
  }
}

export class Flex extends React.Component {
  render() {
    return <View display="flex" {...this.props} />
  }
}

export class Row extends React.Component {
  render() {
    return <Flex flexDirection="row" {...this.props} />
  }
}

export class Column extends React.Component {
  render() {
    return <Flex flexDirection="column" {...this.props} />
  }
}

