// a port of https://github.com/ismamz/postcss-utilities

// todo -
// - hd breakpoint 
// - sticky footers

import { after, merge, select } from './index.js'

export function aspectRatio(width = 16, height = 9) {  
  return {
    position: 'relative',
    display: 'block',
    height: 0,
    padding: 0,
    overflow: 'hidden',
    paddingBottom: ((height / width) * 100) + '%'
  }
}

// border-radius

export function borderBottomRadius(r) {  
  return {
    borderBottomLeftRadius: r,
    borderBottomRightRadius: r
  }
}

export function borderTopRadius(r) {
  return {
    borderTopLeftRadius: r,
    borderTopRightRadius: r
  }
}

export function borderLeftRadius(r) {
  return {
    borderTopLeftRadius: r,
    borderBottomLeftRadius: r
  }
}

export function borderRightRadius(r) {
  
  return {
    borderTopRightRadius: r,
    borderBottomRightRadius: r
  }
}


function styleKeyed(prefix, key, { top, right, bottom, left }) {  
  let o = {}
  if(top != undefined ) {
    o[prefix + 'Top' + key] = top
  }
  if(right != undefined) {
    o[prefix + 'Right' + key] = right
  }
  if(bottom != undefined) {
    o[prefix + 'Bottom' + key] = bottom
  }
  if(left != undefined) {
    o[prefix + 'Left' + key] = left
  }
  return o
}


export function borderColor(x) {
  return styleKeyed('border', 'Color', x)  
}

export function borderStyle(x) {
  return styleKeyed('border', 'Style', x)  
}

export function borderWidth(x) {
  return styleKeyed('border', 'Width', x)  
}

export function center() {
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
}

export function centerBlock() {
  return {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}

export function circle(radius, color = 'transparent') {
  return {
    height: radius,
    width: radius, 
    borderRadius: '50%',
    backgroundColor: color    
  }
}

export function hideVisually() {
  return {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    border: 0
  }
}

export function hr(color ='#ccc', verticalMargin = '1em') {
  return {
    height: 1,
    border: 0,
    borderTop: `1px solid ${color}`,
    margin: `${verticalMargin} 0`,
    display: 'block'
  }
}

export function margin(x) {
  return styleKeyed('margin', '', x)
}

export function padding(x) {
  return styleKeyed('padding', '', x)
}

export function position(type, { top, left, bottom, right }) {
  let o = {
    position: type
  }
  if(top != undefined ) {
    o.top = top
  }
  if(right != undefined) {
    o.right = right
  }
  if(bottom != undefined) {
    o.bottom = bottom
  }
  if(left != undefined) {
    o.left = left
  }
  return o
}

export function resetText() {
  return {
    fontFamily: 'sans-serif',
    fontStyle: 'normal',
    fontWeight: 'normal',
    letterSpacing: 'normal',
    lineBreak: 'auto',
    lineHeight: '1.5',
    textAlign: [ 'left', 'start' ],
    textDecoration: 'none',
    textShadow: 'none',
    textTransform: 'none',
    whiteSpace: 'normal',
    wordBreak: 'normal',
    wordSpacing: 'normal',
    wordWrap: 'normal'
  }
}

export function size(width, height = width) {  
  return {
    width,
    height
  }
}

// export function stickyFooterWrapper(selector = '.footer', fixedHeight = false) {
//   if(fixedHeight === false) {
//     return merge({
//       display: 'table',
//       width: '100%',
//       height: '100%'
//     }, select(` ${selector}`, {
//       display: 'table-row',
//       height: 1
//     }))  
//   }
//   return merge({
//     minHeight: '100%',
//     marginBottom: typeof fixedHeight === 'number' ? -1 * fixedHeight : `-${fixedHeight}`
//   }, after({
//     display: 'block',
//     content: '',
//     height: fixedHeight
//   }), select(` ${selector}`, {    
//     height: fixedHeight
//   }))
// }

export function textHide(alternative = false) {
  if(!alternative) {
    return {
      font: '"0/0" a',
      color: 'transparent',
      textShadow: 'none',
      backgroundColor: 'transparent',
      border: 0
    }
  }
  return {
    overflow: 'hidden',
    textIndent: '101%',
    whiteSpace: 'nowrap'
  }
}


export function triangle(size = 12, color = '#ccc', orientation = 'down') {
  // let border 
  let border = (dir => {
    switch(dir) {
      case 'down': return [ true, 't', false, 't' ]
      case 'up': return [ false, 't', true, 't' ]
      case 'left': return [ 't', true, 't', false ]
      case 'right': return [ 't', false, 't', true ]
      case 'up-right': return [ true, false, false, 't' ]
      case 'up-left': return [ true, 't', false, false ]
      case 'down-right': return [ false, false, true, 't' ]
      case 'down-left': return [ false, 't', true, false ]
      default: throw new Error('Circle orientation is not valid.')  
    }
  })(orientation)
  
  let o = {
    height: 0,
    width: 0
  }
  if(border[0] === true) {
    o.borderTop = size + ' solid ' + color
  }
  if (border[1] === true) { // right
    o.borderRight = size + ' solid ' + color
  }

  if (border[2] === true) { // bottom
    o.borderBottom = size + ' solid ' + color
  }

  if (border[3] === true) { // left
    o.borderLeft = size + ' solid ' + color      
  }
  if (border[0] === 't') { // top
    o.borderTop = size + ' solid transparent'
  }

  if (border[1] === 't') { // right
    o.borderRight = size + ' solid transparent'
          
  }

  if (border[2] === 't') { // bottom
    o.borderBottom = size + ' solid transparent'          
  }

  if (border[3] === 't') { // left
    o.borderLeft = size + ' solid transparent'
  }

  return o
}

export function truncate(lines = 0, lineHeight = 1, textOverflow = 'ellipsis') {
  if(!lines) {
    return {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow
    }
  }

  let height = Math.round(lineHeight * lines * 100) / 100

  return {
    display: [ 'block', '-webkit-box' ],
    height: height + 'em',
    lineHeight,
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow
  }
  
}

export function wordWrap(wrap = 'break-word', wordBreak = wrap !== 'break-word' ? wrap : 'break-all') {
  return {
    overflowWrap: wrap,
    wordBreak: wordBreak,
    wordWrap: wrap
  }
}

// these return rules

export function clearfix() {
  return after({
    content: '""',
    display: 'block',
    clear: 'both'
  })
}


export function resetList() {
  return merge({
    marginTop: 0,
    marginBottom: 0,
    paddingLeft: 0
  }, select( 'li', {
    listStyle: 'none'
  }))
}

export function noJs(childSelector, style) {
  return parent(childSelector, '.no-js', style)
}

export function noHover(childSelector, style) {
  return parent(childSelector, '.no-hover', style)
}
