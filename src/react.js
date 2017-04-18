import assign from 'object-assign'
import PropTypes from 'prop-types'
import React from 'react'
import { isLikeRule, style, merge } from './index.js'

if(process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  console.warn('[Deprecation] In glamor v3 this file will be published as a standalone package: "glamor-react". See https://github.com/threepointone/glamor/issues/204 for more information.') // eslint-disable-line no-console
}

export * from './index.js' // convenience

// allows for elements to have a 'css' prop
export function createElement(tag, allProps, ...children) {
  // todo - pull ids from className as well?
  if(allProps && allProps.css) {
    let { css, className, ...props } = allProps
    let rule = Array.isArray(css) ? merge(...css) :
        isLikeRule(css) ? css :
        style(css)
    className = className ? className + ' ' + rule : rule
    props.className = className
    return React.createElement(tag, props, ...children)
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
            ...((typeof value === 'function' ? value(this.props) : value))
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
              ...(this.context[key] || []) )
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
              ...(this.context[key] || []) ]
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

function toStyle(s) {
  return s!= null && isLikeRule(s) ? s : style(s)
}

// propMerge will take an arbitrary object "props", filter out glamor data-css-* styles and merge it with "mergeStyle"
// use it for react components composing
export function propMerge(mergeStyle, props) {
  const glamorStyleKeys = Object.keys(props).filter(x => !!/data\-css\-([a-zA-Z0-9]+)/.exec(x))

  // no glamor styles in obj
  if (glamorStyleKeys.length === 0) {
    return {
      ...props,
      ...toStyle(mergeStyle)
    }
  }

  if (glamorStyleKeys.length > 1) {
    console.warn('[glamor] detected multiple data attributes on an element. This may lead to unexpected style because of css insertion order.') // eslint-disable-line no-console

    // just append "mergeStyle" to props, because we dunno in which order glamor styles were added to props
    return {
      ...props,
      ...toStyle(mergeStyle)
    }
  }

  const dataCssKey= glamorStyleKeys[0]
  const cssData = props[dataCssKey]

  const mergedStyles = merge(mergeStyle, { [dataCssKey]: cssData })

  const restProps = assign({}, props)
  delete restProps[dataCssKey]

  return {
    ...restProps,
    ...mergedStyles
  }
}
