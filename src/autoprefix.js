// from https://github.com/petehunt/jsxstyle/blob/master/lib/autoprefix.js

// todo - rewrite to be
let assign = Object.assign

export default function autoprefix(style) {
  let toAdd = {}
  if (style.hasOwnProperty('userSelect')) {
    assign(toAdd, {
      WebkitUserSelect: style.userSelect,
      MozUserSelect: style.userSelect,
      msUserSelect: style.userSelect
    })
  }

  if (style.hasOwnProperty('transition')) {
    assign(toAdd, {
      WebkitTransition: style.transition,
      MozTransition: style.transition,
      msTransition: style.transition
    })
  }

  if (style.hasOwnProperty('boxShadow')) {
    assign(toAdd, {
      WebkitBoxShadow: style.boxShadow,
      MozBoxShadow: style.boxShadow,
      msBoxSelect: style.boxShadow
    })
  }

  if (style.hasOwnProperty('fontSmoothing')) {
    assign(toAdd, {
      WebkitFontSmoothing: style.fontSmoothing,
      MozOsxFontSmoothing: style.fontSmoothing === 'antialiased' ? 'grayscale' : undefined
    })
  }

  if (style.hasOwnProperty('flexDirection')) {
    assign(toAdd, {
      WebkitFlexDirection: style.flexDirection
    })
  }

  if (style.hasOwnProperty('flexWrap')) {
    assign(toAdd, {
      WebkitFlexWrap: style.flexWrap
    })
  }

  if (style.hasOwnProperty('alignItems')) {
    assign(toAdd, {
      WebkitAlignItems: style.alignItems
    })
  }

  if (style.hasOwnProperty('flexGrow')) {
    assign(toAdd, {
      WebkitFlexGrow: style.flexGrow
    })
  }

  if (style.hasOwnProperty('flexShrink')) {
    assign(toAdd, {
      WebkitFlexShrink: style.flexShrink
    })
  }

  if (style.hasOwnProperty('order')) {
    assign(toAdd, {
      WebkitOrder: style.order
    })
  }

  if (style.hasOwnProperty('justifyContent')) {
    assign(toAdd, {
      WebkitJustifyContent: style.justifyContent
    })
  }

  if (style.hasOwnProperty('flex')) {
    assign(toAdd, {
      WebkitFlex: style.flex
    })
  }

  if (style.display === 'flex') {
    toAdd.display = style.display + 'display:-webkit-flexdisplay:-ms-flexbox'
  }

  return { ...style, ...toAdd }
}
