import assign from 'object-assign'
import React from 'react'
import * as glamor from './index'


// import shallowCompare from 'react-addons-shallow-compare'
let withKeys = (...keys) => keys.reduce((o, k) => (o[k] = true, o), {})

// need this list for SSR. 2k gzipped. worth the cost.
let propNames = withKeys('alignContent', 'alignItems', 'alignSelf', 'alignmentBaseline', 'all', 'animation', 'animationDelay',
  'animationDirection', 'animationDuration', 'animationFillMode', 'animationIterationCount', 'animationName',
  'animationPlayState', 'animationTimingFunction', 'backfaceVisibility', 'background', 'backgroundAttachment',
  'backgroundBlendMode', 'backgroundClip', 'backgroundColor', 'backgroundImage', 'backgroundOrigin', 'backgroundPosition',
  'backgroundPositionX', 'backgroundPositionY', 'backgroundRepeat', 'backgroundRepeatX', 'backgroundRepeatY', 'backgroundSize',
  'baselineShift', 'border', 'borderBottom', 'borderBottomColor', 'borderBottomLeftRadius', 'borderBottomRightRadius',
  'borderBottomStyle', 'borderBottomWidth', 'borderCollapse', 'borderColor', 'borderImage', 'borderImageOutset',
  'borderImageRepeat', 'borderImageSlice', 'borderImageSource', 'borderImageWidth', 'borderLeft', 'borderLeftColor',
  'borderLeftStyle', 'borderLeftWidth', 'borderRadius', 'borderRight', 'borderRightColor', 'borderRightStyle',
  'borderRightWidth', 'borderSpacing', 'borderStyle', 'borderTop', 'borderTopColor', 'borderTopLeftRadius',
  'borderTopRightRadius', 'borderTopStyle', 'borderTopWidth', 'borderWidth', 'bottom', 'boxShadow', 'boxSizing',
  'breakAfter', 'breakBefore', 'breakInside', 'bufferedRendering', 'captionSide', 'clear', 'clip', 'clipPath',
  'clipRule', 'color', 'colorInterpolation', 'colorInterpolationFilters', 'colorRendering', 'columnCount',
  'columnFill', 'columnGap', 'columnRule', 'columnRuleColor', 'columnRuleStyle', 'columnRuleWidth', 'columnSpan',
  'columnWidth', 'columns', 'contain', 'content', 'counterIncrement', 'counterReset', 'cursor', 'cx', 'cy', 'd',
  'direction', 'display', 'dominantBaseline', 'emptyCells', 'fill', 'fillOpacity', 'fillRule', 'filter', 'flex',
  'flexBasis', 'flexDirection', 'flexFlow', 'flexGrow', 'flexShrink', 'flexWrap', 'float', 'floodColor', 'floodOpacity',
  'font', 'fontFamily', 'fontFeatureSettings', 'fontKerning', 'fontSize', 'fontStretch', 'fontStyle', 'fontVariant',
  'fontVariantCaps', 'fontVariantLigatures', 'fontVariantNumeric', 'fontWeight', 'height', 'imageRendering', 'isolation',
  'justifyContent', 'left', 'letterSpacing', 'lightingColor', 'lineHeight', 'listStyle', 'listStyleImage', 'listStylePosition',
  'listStyleType', 'margin', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop', 'marker', 'markerEnd', 'markerMid',
  'markerStart', 'mask', 'maskType', 'maxHeight', 'maxWidth', 'maxZoom', 'minHeight', 'minWidth', 'minZoom', 'mixBlendMode',
  'motion', 'motionOffset', 'motionPath', 'motionRotation', 'objectFit', 'objectPosition', 'opacity', 'order', 'orientation',
  'orphans', 'outline', 'outlineColor', 'outlineOffset', 'outlineStyle', 'outlineWidth', 'overflow', 'overflowWrap', 'overflowX',
  'overflowY', 'padding', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'page', 'pageBreakAfter',
  'pageBreakBefore', 'pageBreakInside', 'paintOrder', 'perspective', 'perspectiveOrigin', 'pointerEvents', 'position', 'quotes',
  'r', 'resize', 'right', 'rx', 'ry', 'shapeImageThreshold', 'shapeMargin', 'shapeOutside', 'shapeRendering', 'size', 'speak',
  'src', 'stopColor', 'stopOpacity', 'stroke', 'strokeDasharray', 'strokeDashoffset', 'strokeLinecap', 'strokeLinejoin',
  'strokeMiterlimit', 'strokeOpacity', 'strokeWidth', 'tabSize', 'tableLayout', 'textAlign', 'textAlignLast', 'textAnchor',
  'textCombineUpright', 'textDecoration', 'textIndent', 'textOrientation', 'textOverflow', 'textRendering', 'textShadow',
  'textTransform', 'top', 'touchAction', 'transform', 'transformOrigin', 'transformStyle', 'transition', 'transitionDelay',
  'transitionDuration', 'transitionProperty', 'transitionTimingFunction', 'unicodeBidi', 'unicodeRange', 'userZoom',
  'vectorEffect', 'verticalAlign', 'visibility', 'appRegion', 'appearance', 'backgroundClip', 'backgroundOrigin',
  'borderAfter', 'borderAfterColor', 'borderAfterStyle', 'borderAfterWidth', 'borderBefore', 'borderBeforeColor',
  'borderBeforeStyle', 'borderBeforeWidth', 'borderEnd', 'borderEndColor', 'borderEndStyle', 'borderEndWidth',
  'borderHorizontalSpacing', 'borderImage', 'borderStart', 'borderStartColor', 'borderStartStyle',
  'borderStartWidth', 'borderVerticalSpacing', 'boxAlign', 'boxDecorationBreak', 'boxDirection', 'boxFlex',
  'boxFlexGroup', 'boxLines', 'boxOrdinalGroup', 'boxOrient', 'boxPack', 'boxReflect', 'clipPath',
  'columnBreakAfter', 'columnBreakBefore', 'columnBreakInside', 'filter', 'fontSizeDelta', 'fontSmoothing',
  'highlight', 'hyphenateCharacter', 'lineBreak', 'lineClamp', 'locale', 'logicalHeight', 'logicalWidth',
  'marginAfter', 'marginAfterCollapse', 'marginBefore', 'marginBeforeCollapse', 'marginBottomCollapse',
  'marginCollapse', 'marginEnd', 'marginStart', 'marginTopCollapse', 'mask', 'maskBoxImage', 'maskBoxImageOutset',
  'maskBoxImageRepeat', 'maskBoxImageSlice', 'maskBoxImageSource', 'maskBoxImageWidth', 'maskClip', 'maskComposite',
  'maskImage', 'maskOrigin', 'maskPosition', 'maskPositionX', 'maskPositionY', 'maskRepeat', 'maskRepeatX', 'maskRepeatY',
  'maskSize', 'maxLogicalHeight', 'maxLogicalWidth', 'minLogicalHeight', 'minLogicalWidth', 'paddingAfter', 'paddingBefore',
  'paddingEnd', 'paddingStart', 'perspectiveOriginX', 'perspectiveOriginY', 'printColorAdjust', 'rtlOrdering', 'rubyPosition',
  'tapHighlightColor', 'textCombine', 'textDecorationsInEffect', 'textEmphasis', 'textEmphasisColor', 'textEmphasisPosition',
  'textEmphasisStyle', 'textFillColor', 'textOrientation', 'textSecurity', 'textStroke', 'textStrokeColor', 'textStrokeWidth',
  'transformOriginX', 'transformOriginY', 'transformOriginZ', 'userDrag', 'userModify', 'userSelect', 'writingMode', 'whiteSpace',
  'widows', 'width', 'willChange', 'wordBreak', 'wordSpacing', 'wordWrap', 'writingMode', 'x', 'y', 'zIndex', 'zoom'
)

let pseudos = withKeys(
  // pseudoclasses
  'active', 'any', 'checked', 'disabled', 'empty', 'enabled', '_default', 'first', 'firstChild', 'firstOfType',
  'fullscreen', 'focus', 'hover', 'indeterminate', 'inRange', 'invalid', 'lastChild', 'lastOfType', 'left',
  'link', 'onlyChild', 'onlyOfType', 'optional', 'outOfRange', 'readOnly', 'readWrite', 'required', 'right',
  'root', 'scope', 'target', 'valid', 'visited',
  // pseudoelements
  'after', 'before', 'firstLetter', 'firstLine', 'selection', 'backdrop', 'placeholder'
)

let parameterizedPseudos = withKeys(
 'dir', 'lang', 'not', 'nthChild', 'nthLastChild', 'nthLastOfType', 'nthOfType'
)

// const STYLE_PROP_NAMES = propNames.reduce((styles, key) => {
//   styles[key] = true
//   return styles
// }, { label: true })

// /^(webkit|moz|ms)([A-Za-z]+)/
let prefixCache = {}
function prefixed(key) {
  if(prefixCache.hasOwnProperty(key)) {
    return prefixCache[key]
  }
  let m = /^(webkit|moz|ms|o){1}([A-Z][A-Za-z]+)/.exec(key), subKey
  if(m) {
    subKey = m[2]
    subKey = subKey.charAt(0).toLowerCase() + subKey.slice(1)
  }
  prefixCache[key] = subKey
  return subKey
}

function isHandler(key) {
  return !!/^on[A-Z]/.exec(key)
}

const splitStyles = (combinedProps) => {
  const props = {}, gStyle = [], style = {}
  Object.keys(combinedProps).forEach((key) => {

    if (propNames[key]) {
      style[key] = combinedProps[key]
    }
    else if(prefixed(key) && propNames[prefixed(key)]) {
      style[key] = combinedProps[key]
    }
    else if(key === 'css') {
      assign(style, combinedProps[key])
    }
    else if (pseudos[key] >= 0) {
      gStyle.push(glamor[key](combinedProps[key]))
    }
    else if (parameterizedPseudos[key] || (key === 'media') || (key === 'select')) {
      gStyle.push(glamor[key](...combinedProps[key]))
    }
    else if((key === 'merge') || (key === 'compose')) {
      if(Array.isArray(combinedProps[key])) {
        gStyle.splice(gStyle.length, 0, ...combinedProps[key])
      }
      else {
        gStyle.splice(gStyle.length, 0, combinedProps[key])
      }
    }
    else if(isHandler(key)) {
      props[key] = combinedProps[key]
    }
    else if (key === 'props') {
      assign(props, combinedProps[key])
    }
    else if(key === 'style' || key === 'className' || key === 'children') {
      props[key] = combinedProps[key]
    }
    else {
      // console.warn('irregular key ' + key)    //eslint-disable-line no-console
      props[key] = combinedProps[key]
    }
  })
  return { ...gStyle.length > 0 ?
    glamor.merge(style, ...gStyle) :
    Object.keys(style).length > 0 ?
      glamor.style(style) :
      {},
    ...props }
}

export class View extends React.Component {
  static defaultProps = {
    component: 'div'
  }

  render() {
    const { component: Component, ...props } = this.props
    return <Component {...splitStyles(props)} />
  }
}

export class Block extends React.Component {
  render() {
    return <View display="block" {...this.props} />
  }
}

export class InlineBlock extends React.Component {
  render() {
    return <View display="inline-block" {...this.props} />
  }
}

export class Flex extends React.Component {
  render() {
    return <View display="flex" {...this.props} />
  }
}

export class Row extends React.Component {
  render() {
    return <Flex flexDirection="row" {...this.props} />
  }
}

export class Column extends React.Component {
  render() {
    return <Flex flexDirection="column" {...this.props} />
  }
}
