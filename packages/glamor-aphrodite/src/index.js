import { css as _css } from 'glamor'

// todo 
// - animations 
// - fonts 

export const StyleSheet = {
  create(spec) {
    return Object.keys(spec)
      .reduce((o, name) =>
        (o[name] = _css(spec[name]), o), {})
  }
}

export function css(...rules) {
  return _css(...rules.filter(x => !!x)) // aphrodite compat https://github.com/threepointone/glamor/issues/170
}
