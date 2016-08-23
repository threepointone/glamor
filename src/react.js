import React, { PropTypes } from 'react'
import { isRule, style, merge } from './index.js'

export const createElement = (tag, { css, ...props }, children) => {
  if(typeof tag === 'string' && css) {
    return React.createElement(tag, { 
      ...props, 
      ...Array.isArray(css) ? merge(...css) : 
        isRule(css) ? css : 
        style(css) 
    }, children)
  }
  return React.createElement(tag, props, children )
}

let overrideIndex = 0

export const override = () => {
  let key = `data-glamor-override-${overrideIndex++}`
  return {
    name: key,
    Override: class Override extends React.Component {
      static contextTypes = {
        [key]: PropTypes.arrayOf(PropTypes.object)
      }
      static childContextTypes = {
        [key]: PropTypes.arrayOf(PropTypes.object)  
      }
      getChildContext() {
        // todo - make sure these are rules 
        return {
          [key]: [ ...Object.keys(this.props).map(x => ({ [x]: this.props[x] })), 
          ...this.context[key] || [] ]
        }
      }
      render() {
        return this.props.children
      }
    },
    base(_default) {
      return Target => {
        return class OverrideGet extends React.Component {
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
      
    },
    add(_style) {
      return Target => {
        return class OverrideSet extends React.Component {
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
  }
}

export function vars(value = {}) {
  return function (Target) {
    return class Theme extends React.Component {
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
          { ...this.props, vars: this.context.glamorCssVars }, 
          this.props.children
        )
      }
    }
  }
}
