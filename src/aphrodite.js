import { style } from './index.js'

if(process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  console.warn('[Deprecation] In glamor v3 this file will be published as a standalone package: "glamor-aphrodite". See https://github.com/threepointone/glamor/issues/204 for more information.')
}

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
