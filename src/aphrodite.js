import * as glamor from './index.js'
import React from 'react'

function stylesToRule(o) {
  let _style = {}, _rules = []
  Object.keys(o).forEach(key => {
    if(key.charAt(0) === ':') {
      if(key.charAt(1) === ':') {        
        _rules.push(glamor[key.slice(2)](o[key]))
      }
      else {

        _rules.push(glamor[key.slice(1)](o[key]))  
      }
      // todo - parameterized pseudos           
    }
    else if(/^\@media/.exec(key)) {
      _rules.push(glamor.media(key.substring(6), stylesToRule(o[key])))    
    }
    else {
      _style[key] = o[key]
    }
    
  })  
  return glamor.merge(_style || {}, ..._rules)
}

export const StyleSheet = {
  create(spec) {    
    let entries = Object.keys(spec).map(name => {
      let rule = stylesToRule(spec[name])
      return [ name, `data-css-${glamor.idFor(rule)}` ]
    })

    return entries.reduce((o, [ name, val ]) => (o[name] = val, o), {})
  }
}

export function css(...rules) {
  return rules.filter(x => !!x).join(' ')
}

export function createElement(tag, props = {}, children) {
  let styles = ((props || {}).className || '')
    .split(' ')
    .filter(x => /^data\-css\-/.exec(x))
    .map(x => ({ [x] : '' }))

  return React.createElement(tag, { ...props, ... styles.length > 0 ? glamor.merge(...styles) : {} }, children)

}

// todo - animations 
// fonts 
