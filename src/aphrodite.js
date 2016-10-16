import { merge, style } from './index.js'

// todo 
// - animations 
// - fonts 

export const StyleSheet = {
  create(spec) {    
    return Object.keys(spec)
      .reduce((o, name) => 
        (o[name] = style(spec[name]), o), {})
  }
}

export const css = merge
