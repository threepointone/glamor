import { merge, style } from './index.js'

// todo 
// - animations 
// - fonts 


export const StyleSheet = {
  create(spec) {    
    let entries = Object.keys(spec).map(name => {
      let rule = style(spec[name])
      return [ name, rule ]
    })

    return entries.reduce((o, [ name, val ]) => (o[name] = val, o), {})
  }
}

export function css(...rules) {  
  return merge(...rules)
}

