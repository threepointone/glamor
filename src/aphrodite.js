import * as glamor from './index.js'
export const Stylesheet = {
  create(spec) {
    
    let entries = Object.keys(spec).map(name => {
      let _style = {}, _rules = []
      Object.keys(spec[name]).forEach(key => {

        if(key.charAt(0) === ':') {
          if(key.charAt(1) === ':') {
            _rules.push(glamor[key.slice(2)](spec[key]))
          }
          else {
            _rules.push(glamor[key.slice(1)](spec[key]))  
          }
          // todo - parameterized pseudos           
        }
        if(/^\@media/.exec(key)) {
          _rules.push(glamor.media(key.substring(6, key.indexOf('{') - 1)))    
        }
        else {
          _style[key] = spec[name][key]
        }
        
      })
      return [ name, glamor.idFor(glamor.merge(_style, ..._rules)) ]
    })

    return entries.reduce((o, [ name, val ]) => (o[name] = val, o), {})
  }
}

export function css(...rules) {
  return rules.filter(x => !!x).join(' ')
  // return just data-css-<id> string. we then expect createElement to catch it and transform into attribs 
}

// todo - animations 
// fonts 