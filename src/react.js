import React, { PropTypes } from 'react'
import { isLikeRule, style, merge } from './index.js'

export * from './index.js' // convenience

// allows for dom elements to have a 'css' prop
export function createElement(tag, allProps, ...children) { 
  // todo - pull ids from className as well? 
  if(typeof tag === 'string' && allProps && allProps.css) {
    let { css , ...props } = allProps
    return React.createElement(tag, { 
      ...props, 
      ...Array.isArray(css) ? merge(...css) : 
        isLikeRule(css) ? css : 
        style(css) 
    }, ...children)
  }
  return React.createElement(tag, allProps, ...children)
}

export const dom = createElement

// css vars, done right 
// see examples/vars for usage 
export function vars(value = {}) {
  return function (Target) {
    return class Vars extends React.Component {
      static childContextTypes = {
        glamorCssVars: PropTypes.object
      }
      static contextTypes = {
        glamorCssVars: PropTypes.object  
      }
      getChildContext() {
        return { 
          glamorCssVars: { 
            ...this.context.glamorCssVars, 
            ...typeof value === 'function' ? value(this.props) : value 
          }
        }
      }
      render() {
        return React.createElement(Target, 
          { ...this.props, vars: this.context.glamorCssVars || (typeof value === 'function' ? value(this.props) : value)  }, 
          this.props.children
        )
      }
    }
  }
}

// @styled(...{})
// @styled(name, ...{})

// @styled(Button, ...{})
// @styled(Button, name, ...{}) // should throw if not defined? 

// override(Button, ...{})(element)
// override(Button, name, ...{})(element)

let themeIndex = 0

export function makeTheme() {  

  let key = `data-glamor-theme-${themeIndex++}`

  let fn = (_default) => {
    return Target => {
      return class Theme extends React.Component {
        static contextTypes = {
          [key]: PropTypes.arrayOf(PropTypes.object)
        }
        render() {
          return React.createElement(Target, {
            ...this.props,
            [key]: merge( typeof _default === 'function' ? 
                _default(this.props) : 
                _default, 
              ...this.context[key] )
          })
        }
      }  
    }
  }

  fn.key = key
  fn.add = (_style) => {
    return Target => {
      return class ThemeOverride extends React.Component {
        static contextTypes = {
          [key]: PropTypes.arrayOf(PropTypes.object)
        }
        static childContextTypes = {
          [key]: PropTypes.arrayOf(PropTypes.object)  
        }
        getChildContext() {
          return {
            [key]: [ typeof _style === 'function' ? 
              _style(this.props) : 
              _style, 
            ...this.context[key] || [] ]
          }
        }
        render() {
          return React.createElement(Target, this.props)
        }
      }  
    }      
  }
  return fn 
  
}

