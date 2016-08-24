// import { color } from './color'
import { media } from './index'


// @vars and modules solve 
// custom properties: var, set, apply
// custom media queries
// custom selectors
// nesting is solved with select() + compose()

// media query ranges 
export function mediaQuery(expr, ...styles) {
  // rewrite expr
  // call media
  return media(expr, ...styles)
}

// font-variant 
let fontVariantProperties = {
  "font-variant-ligatures": {
    "common-ligatures": "\"liga\", \"clig\"",
    "no-common-ligatures": "\"liga\", \"clig off\"",
    "discretionary-ligatures": "\"dlig\"",
    "no-discretionary-ligatures": "\"dlig\" off",
    "historical-ligatures": "\"hlig\"",
    "no-historical-ligatures": "\"hlig\" off",
    contextual: "\"calt\"",
    "no-contextual": "\"calt\" off"
  },

  "font-variant-position": {
    sub: "\"subs\"",
    "super": "\"sups\"",
    normal: "\"subs\" off, \"sups\" off"
  },

  "font-variant-caps": {
    "small-caps": "\"c2sc\"",
    "all-small-caps": "\"smcp\", \"c2sc\"",
    "petite-caps": "\"pcap\"",
    "all-petite-caps": "\"pcap\", \"c2pc\"",
    unicase: "\"unic\"",
    "titling-caps": "\"titl\""
  },

  "font-variant-numeric": {
    "lining-nums": "\"lnum\"",
    "oldstyle-nums": "\"onum\"",
    "proportional-nums": "\"pnum\"",
    "tabular-nums": "\"tnum\"",
    "diagonal-fractions": "\"frac\"",
    "stacked-fractions": "\"afrc\"",
    ordinal: "\"ordn\"",
    "slashed-zero": "\"zero\""
  },

  "font-kerning": {
    normal: "\"kern\"",
    none: "\"kern\" off"
  },

  "font-variant": {
    normal: "normal",
    inherit: "inherit"
  }
}

// The `font-variant` property is a shorthand for all the others.
for (let prop in fontVariantProperties) {
  let keys = fontVariantProperties[prop]
  for (let key in keys) {
    if (!(key in fontVariantProperties['font-variant'])) {
      fontVariantProperties['font-variant'][key] = keys[key]
    }
  }
}

export function fontVariant() {

}

// overflow-wrap
export function overflowWrap() {

}


export function anyLink({ selector, ...rest }) {
  let pieces = selector.split(',').map(x => x.trim())
  let result = []
  pieces.forEach(p => {
    if(p.indexOf(':any-link') >=0 ) {
      result.push(p.replace(/\:any\-link/g, ':link'))
      result.push(p.replace(/\:any\-link/g, ':visited'))
    }
    else {
      result.push(p)
    }
  })
  return ({ selector: result.join(', '), ...rest })
  
}

// :matches() - index
export function matches(selectors, x) {

}

// fns 
// color stuff - color.js
// filter - filters.js


// maybe not 
// :: fallback to : for ie8
// initial for any value (?)
// rem fallback to px
