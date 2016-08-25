import { merge, media, select, idFor } from './index.js'

// todo 
// - animations 
// - fonts 

import React from 'react'

function stylesToRule(o) {
  let _style = {}, _rules = []
  Object.keys(o).forEach(key => {
    if(key.charAt(0) === ':') {
      select(key, o[key])
    }
    else if(/^\@media/.exec(key)) {
      _rules.push(media(key.substring(6), stylesToRule(o[key])))    
    }
    else {
      _style[key] = o[key]
    }
    
  })  
  return merge(_style || {}, ..._rules)
}

export const StyleSheet = {
  create(spec) {    
    let entries = Object.keys(spec).map(name => {
      let rule = stylesToRule(spec[name])
      return [ name, `data-css-${idFor(rule)}` ]
    })

    return entries.reduce((o, [ name, val ]) => (o[name] = val, o), {})
  }
}

export function css(...rules) {
  return rules.filter(x => !!x).join(' ')
}

export function createElement(tag, props = {}, children) {
  let styles = ((props || {}).className || '')
    .split(' ').map(x => x.trim())

  let css = styles.filter(x => /^data\-css\-/.exec(x)).map(x => ({ [x] : '' }))
  let classes = styles.filter(x => !/^data\-css\-/.exec(x)).join(' ')
          

  return React.createElement(tag, { ...props, ...(props || {}).className ? { className: classes || null } : {}, ... css.length > 0 ? merge(...css) : {} }, children)

}

