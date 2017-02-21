import React from 'react'
import { merge, style } from '../'

import { parser, convert } from '../css/raw'
let __val__ = (x, props) => typeof x === 'function' ? x(props) : x

export function styled(Component, obj) { // todo - read style off Component if it exists 
  if(obj) {
    // for when transpiled, and / or by hand 
    return class StyledComponent extends React.Component {

      render() {
        let { css, ...props } = this.props
        let orig_css = typeof obj === 'function' ? obj(__val__, this.props) : obj
        
        return <Component {...props} {...this.props.css ? merge(orig_css, css) : style(orig_css)}/> // todo - isLikeRule 
      }
    }  
  }
  return function (strings, ...values) {
    // in-browser parsing
    let { parsed, stubs } = parser(strings, ...values)
    return class StyledComponent extends React.Component {
      render() {
        let { className = '', css, ...props } = this.props
        return <Component className={className + ' ' + merge(convert(parsed, { stubs, args: [ this.props ] }), css || {})} {...props} />
      }
    }
  }
}

// copied straight from styled-components 

styled.a = styled('a')
styled.abbr = styled('abbr')
styled.address = styled('address')
styled.area = styled('area')
styled.article = styled('article')
styled.aside = styled('aside')
styled.audio = styled('audio')
styled.b = styled('b')
styled.base = styled('base')
styled.bdi = styled('bdi')
styled.bdo = styled('bdo')
styled.big = styled('big')
styled.blockquote = styled('blockquote')
styled.body = styled('body')
styled.br = styled('br')
styled.button = styled('button')
styled.canvas = styled('canvas')
styled.caption = styled('caption')
styled.cite = styled('cite')
styled.code = styled('code')
styled.col = styled('col')
styled.colgroup = styled('colgroup')
styled.data = styled('data')
styled.datalist = styled('datalist')
styled.dd = styled('dd')
styled.del = styled('del')
styled.details = styled('details')
styled.dfn = styled('dfn')
styled.dialog = styled('dialog')
styled.div = styled('div')
styled.dl = styled('dl')
styled.dt = styled('dt')
styled.em = styled('em')
styled.embed = styled('embed')
styled.fieldset = styled('fieldset')
styled.figcaption = styled('figcaption')
styled.figure = styled('figure')
styled.footer = styled('footer')
styled.form = styled('form')
styled.h1 = styled('h1')
styled.h2 = styled('h2')
styled.h3 = styled('h3')
styled.h4 = styled('h4')
styled.h5 = styled('h5')
styled.h6 = styled('h6')
styled.head = styled('head')
styled.header = styled('header')
styled.hgroup = styled('hgroup')
styled.hr = styled('hr')
styled.html = styled('html')
styled.i = styled('i')
styled.iframe = styled('iframe')
styled.img = styled('img')
styled.input = styled('input')
styled.ins = styled('ins')
styled.kbd = styled('kbd')
styled.keygen = styled('keygen')
styled.label = styled('label')
styled.legend = styled('legend')
styled.li = styled('li')
styled.link = styled('link')
styled.main = styled('main')
styled.map = styled('map')
styled.mark = styled('mark')
styled.menu = styled('menu')
styled.menuitem = styled('menuitem')
styled.meta = styled('meta')
styled.meter = styled('meter')
styled.nav = styled('nav')
styled.noscript = styled('noscript')
styled.object = styled('object')
styled.ol = styled('ol')
styled.optgroup = styled('optgroup')
styled.option = styled('option')
styled.output = styled('output')
styled.p = styled('p')
styled.param = styled('param')
styled.picture = styled('picture')
styled.pre = styled('pre')
styled.progress = styled('progress')
styled.q = styled('q')
styled.rp = styled('rp')
styled.rt = styled('rt')
styled.ruby = styled('ruby')
styled.s = styled('s')
styled.samp = styled('samp')
styled.script = styled('script')
styled.section = styled('section')
styled.select = styled('select')
styled.small = styled('small')
styled.source = styled('source')
styled.span = styled('span')
styled.strong = styled('strong')
styled.style = styled('style')
styled.sub = styled('sub')
styled.summary = styled('summary')
styled.sup = styled('sup')
styled.table = styled('table')
styled.tbody = styled('tbody')
styled.td = styled('td')
styled.textarea = styled('textarea')
styled.tfoot = styled('tfoot')
styled.th = styled('th')
styled.thead = styled('thead')
styled.time = styled('time')
styled.title = styled('title')
styled.tr = styled('tr')
styled.track = styled('track')
styled.u = styled('u')
styled.ul = styled('ul')
styled.var = styled('var')
styled.video = styled('video')
styled.wbr = styled('wbr')

// SVG
styled.circle = styled('circle')
styled.clipPath = styled('clipPath')
styled.defs = styled('defs')
styled.ellipse = styled('ellipse')
styled.g = styled('g')
styled.image = styled('image')
styled.line = styled('line')
styled.linearGradient = styled('linearGradient')
styled.mask = styled('mask')
styled.path = styled('path')
styled.pattern = styled('pattern')
styled.polygon = styled('polygon')
styled.polyline = styled('polyline')
styled.radialGradient = styled('radialGradient')
styled.rect = styled('rect')
styled.stop = styled('stop')
styled.svg = styled('svg')
styled.text = styled('text')
styled.tspan = styled('tspan')
