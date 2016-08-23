// todo 
// hd breakpoint 
// no-hover 
// no-js 

import { after, style, merge, select } from './src'

export function aspectRatio(width = 16, height = 9) {
  const t = (typeof this !== 'function') ? style : this
  return t({
    position: 'relative',
    display: 'block',
    height: 0,
    padding: 0,
    overflow: 'hidden',
    paddingBottom: ((height / width) * 100) + '%'
  })
}

// border-radius

export function borderBottomRadius(r) {
  const t = (typeof this !== 'function') ? style : this
  return t({
    borderBottomLeftRadius: r,
    borderBottomRightRadius: r
  })
}

export function borderTopRadius(r) {
  const t = (typeof this !== 'function') ? style : this
  return t({
    borderTopLeftRadius: r,
    borderTopRightRadius: r
  })
}

export function borderLeftRadius(r) {
  const t = (typeof this !== 'function') ? style : this
  return t({
    borderTopLeftRadius: r,
    borderBottomLeftRadius: r
  })
}

export function borderRightRadius(r) {
  const t = (typeof this !== 'function') ? style : this
  return t({
    borderTopRightRadius: r,
    borderBottomRightRadius: r
  })
}


function styleKeyed(t, prefix, key, { top, right, bottom, left }) {  
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
  return t(o)
}


export function borderColor(x) {
  const t = (typeof this !== 'function') ? style : this
  return styleKeyed(t, 'border', 'Color', x)  
}

export function borderStyle(x) {
  const t = (typeof this !== 'function') ? style : this
  return styleKeyed(t, 'border', 'Style', x)  
}

export function borderWidth(x) {
  const t = (typeof this !== 'function') ? style : this
  return styleKeyed(t, 'border', 'Width', x)  
}

export function center() {
  const t = (typeof this !== 'function') ? style : this
  return t({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  })
}

export function centerBlock() {
  const t = (typeof this !== 'function') ? style : this
  return t({
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  })
}

export function circle(radius, color = 'transparent') {
  const t = (typeof this !== 'function') ? style : this
  return t({
    height: radius,
    width: radius, 
    borderRadius: '50%',
    backgroundColor: color    
  })
}

export function clearfix() {
  return after({
    content: '""',
    display: 'block',
    clear: 'both'
  })
}

export function hideVisually() {
  const t = (typeof this !== 'function') ? style : this
  return t({
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    border: 0
  })
}

export function hr(color ='#ccc', verticalMargin = '1em') {
  const t = (typeof this !== 'function') ? style : this
  return t({
    height: 1,
    border: 0,
    borderTop: `1px solid ${color}`,
    margin: `${verticalMargin} 0`,
    display: 'block'
  })
}

export function margin(x) {
  return styleKeyed('margin', '', x)
}

export function padding(x) {
  return styleKeyed('padding', '', x)
}

export function position(type, { top, left, bottom, right }) {
  const t = (typeof this !== 'function') ? style : this
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
  return t(o)
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

export function resetText() {
  const t = (typeof this !== 'function') ? style : this  
  return t({
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
  })
}

export function size(width, height = width) {
  const t = (typeof this !== 'function') ? style : this
  return t({
    width,
    height
  })
}

export function stickyFooterWrapper(selector = '.footer', fixedHeight = false) {
  if(fixedHeight === false) {
    return merge({
      display: 'table',
      width: '100%',
      height: '100%'
    }, select(` ${selector}`, {
      display: 'table-row',
      height: 1
    }))  
  }
  return merge({
    minHeight: '100%',
    marginBottom: typeof fixedHeight === 'number' ? -1 * fixedHeight : `-${fixedHeight}`
  }, after({
    display: 'block',
    content: '',
    height: fixedHeight
  }), select(` ${selector}`, {    
    height: fixedHeight
  }))
}

export function textHide(alternative = false) {
  const t = (typeof this !== 'function') ? style : this
  if(!alternative) {
    return t({
      font: '"0/0" a',
      color: 'transparent',
      textShadow: 'none',
      backgroundColor: 'transparent',
      border: 0
    })
  }
  return t({
    overflow: 'hidden',
    textIndent: '101%',
    whiteSpace: 'nowrap'
  })  
}


export function triangle(size = 12, color = '#ccc', orientation = 'down') {
  const t = (typeof this !== 'function') ? style : this

  let border 
  switch(orientation) {
    case 'down':
      border = [ true, 't', false, 't' ]
      break
    case 'up':
      border = [ false, 't', true, 't' ]
      break
    case 'left':
      border = [ 't', true, 't', false ]
      break
    case 'right':
      border = [ 't', false, 't', true ]
      break
    case 'up-right':
      border = [ true, false, false, 't' ]
      break
    case 'up-left':
      border = [ true, 't', false, false ]
      break
    case 'down-right':
      border = [ false, false, true, 't' ]
      break
    case 'down-left':
      border = [ false, 't', true, false ]
      break
    default:
      throw new Error('Circle orientation is not valid.')
  }
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

  return t(o)  
}

export function truncate(lines = 0, lineHeight = 1, textOverflow = 'ellipsis') {
  const t = (typeof this !== 'function') ? style : this
  if(!lines) {
    return t({
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow
    })
  }

  let height = Math.round(lineHeight * lines * 100) / 100

  return t({
    display: [ 'block', '-webkit-box' ],
    height: height + 'em',
    lineHeight,
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow
  })
  
}

export function wordWrap(wrap = 'break-word', wordBreak = wrap !== 'break-word' ? wrap : 'break-all') {
  const t = (typeof this !== 'function') ? style : this
  return t({
    overflowWrap: wrap,
    wordBreak: wordBreak,
    wordWrap: wrap
  })
}
