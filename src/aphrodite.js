import { style } from './index.js'

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

export function css(...rules) {
  return style(...rules.filter(x => !!x)) // aphrodite compat https://github.com/threepointone/glamor/issues/170
}
