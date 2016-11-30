// forked from https://www.npmjs.com/package/auto-prefixer

function capitalize(str) {
  return str && str.charAt(0).toUpperCase() + str.substring(1)
}

function includes(obj, search) {
  if (typeof obj === 'number') {
    obj = obj.toString()
  }
  if(!obj.indexOf) {
    throw new Error('this seems to be an invalid value ' + JSON.stringify(obj))
  }
  return obj.indexOf(search) !== -1
}

function values(obj) {
  return Object.keys(obj).map(key => obj[key])
}

let webkitPrefix = 'Webkit'
let mozPrefix = 'Moz'
let msPrefix = 'ms'
let oPrefix = 'o'

let webkit = [ webkitPrefix ]
let webkitO = [ webkitPrefix, oPrefix ]
let moz = [ mozPrefix ]
let ms = [ msPrefix ]

let webkitMoz = [ webkitPrefix, mozPrefix ]
let webkitMozO = [ webkitPrefix, mozPrefix, oPrefix ]
let webkitMozMs = [ webkitPrefix, mozPrefix, msPrefix ]
let webkitMs = [ webkitPrefix, msPrefix ]
let allPrefixes = [ webkitPrefix, msPrefix, mozPrefix, oPrefix ]

let neededRules = {
  alignContent: webkit,
  alignItems: webkit,
  alignSelf: webkit,
  animation: webkitMoz,
  animationDelay: webkitMoz,
  animationDirection: webkitMoz,
  animationDuration: webkitMoz,
  animationFillMode: webkitMoz,
  animationIterationCount: webkitMoz,
  animationName: webkitMoz,
  animationPlayState: webkitMoz,
  animationTimingFunction: webkitMoz,
  appearance: webkitMoz,
  backfaceVisibility: webkitMoz,
  backgroundClip: webkit,
  borderImage: webkitMozO,
  borderImageSlice: webkitMozO,
  boxShadow: webkitMozMs,
  boxSizing: webkitMoz,
  clipPath: webkit,
  columns: webkitMoz,
  cursor: webkitMoz,
  flex: webkitMs, //new flex and 2012 specification , no support for old specification
  flexBasis: webkitMs,
  flexDirection: webkitMs,
  flexFlow: webkitMs,
  flexGrow: webkitMs,
  flexShrink: webkitMs,
  flexWrap: webkitMs,
  fontSmoothing: webkitMoz,
  justifyContent: webkitMoz,
  order: webkitMoz,
  perspective: webkitMoz,
  perspectiveOrigin: webkitMoz,
  transform: webkitMozMs,
  transformOrigin: webkitMozMs,
  transformOriginX: webkitMozMs,
  transformOriginY: webkitMozMs,
  transformOriginZ: webkitMozMs,
  transformStyle: webkitMozMs,
  transition: webkitMozMs,
  transitionDelay: webkitMozMs,
  transitionDuration: webkitMozMs,
  transitionProperty: webkitMozMs,
  transitionTimingFunction: webkitMozMs,
  userSelect: webkitMozMs
}

let neededCssValues = {
  calc: webkitMoz,
  flex: webkitMs
}

let clientPrefix = (() => {
  if(typeof navigator === 'undefined') { //in server rendering
    return allPrefixes //also default when not passing true to 'all vendors' explicitly
  }
  let sUsrAg = navigator.userAgent

  if(includes(sUsrAg, 'Chrome')) { return webkit }
  else if (includes(sUsrAg, 'Safari')) { return webkit }
  else if (includes(sUsrAg, 'Opera')) { return webkitO }
  else if (includes(sUsrAg, 'Firefox')) { return moz }
  else if (includes(sUsrAg, 'MSIE')) { return ms }
  
  return []
})()

function checkAndAddPrefix(styleObj, key, val, allVendors) {

  let oldFlex = true
  
  function valueWithPrefix(cssVal, prefix) {
    return includes(val, cssVal) && (allVendors || includes(clientPrefix, prefix)) ?
        val.replace(cssVal, [ '', prefix.toLowerCase(), cssVal ].join('-')) : null
    //example return -> 'transition: -webkit-transition'

  }

  function createObjectOfValuesWithPrefixes(cssVal) {
    return neededCssValues[cssVal].reduce((o, v)=>{
      o[v.toLowerCase()] = valueWithPrefix(cssVal, v)
      return o
    }, {})
    //example return -> {webkit: -webkit-calc(10% - 1px), moz: -moz-calc(10% - 1px)}
  }

  function composePrefixedValues(objOfPrefixedValues) {
    let composed =
        values(objOfPrefixedValues)
            .filter(str => str !== null)
            .map(str => key + ':' + str)
            .join(';')

    if(composed) { styleObj[key] = styleObj[key] + ';' + composed }
    //example do -> {display: "flex;display:-webkit-flex;display:-ms-flexbox"}
  }

  function valWithoutFlex() {
    return val.replace('flex-', '').toLowerCase()
  }

  if (val === 'flex' && key === 'display') {

    let flex = createObjectOfValuesWithPrefixes('flex')
    if(flex.ms) { flex.ms = flex.ms.replace('flex', 'flexbox') } //special case

    composePrefixedValues(flex)
    //if(oldFlex){styleObj[key] = styleObj[key] + ';display:-webkit-box'; }
    if(oldFlex) { styleObj[key] = '-webkit-box;display:' + styleObj[key] }

    //display:flex is simple case, no need for other checks
    return styleObj
  }


  let allPrefixedCssValues = Object.keys(neededCssValues)
      .filter( c => c !== 'flex')
      .reduce((o, c) => {
        o[c] = createObjectOfValuesWithPrefixes(c)
        return o
      }, {})
  /*
   example allPrefixedCssValues = {
   calc: {
   webkit: "translateX(-webkit-calc(10% - 10px))",
   moz: "translateX(-moz-calc(10% - 10px))"
   },
   flex: {
   ms: null,
   webkit: null
   }
   };*/

  //if(includes(val, 'gradient')){
  //
  //}

  if (neededRules[key]) {

    let prefixes = allVendors ?
        neededRules[key] :
        neededRules[key].filter((vendor)=>{ return (includes(clientPrefix, vendor)) })

    let prefixedProperties = prefixes.reduce((obj, prefix) => {
      let property = val

      //add valueWithPrefixes in their position and null the property
      Object.keys(allPrefixedCssValues).forEach(cssKey=>{
        let cssVal = allPrefixedCssValues[cssKey]
        Object.keys(cssVal).forEach(vendor=>{
          if(cssVal[vendor] && capitalize(prefix) === capitalize(vendor)) {
            property = cssVal[vendor]
            cssVal[vendor] = null
          }
        })
      })

      obj[prefix + capitalize(key)] = property
      return obj
    }, {})

    if(oldFlex) {
      switch (key) {
        case 'flexDirection':
          if(includes(val, 'reverse')) { prefixedProperties.WebkitBoxDirection = 'reverse' }
          else { prefixedProperties.WebkitBoxDirection = 'normal' }
          if(includes(val, 'row')) { prefixedProperties.WebkitBoxOrient = prefixedProperties.boxOrient = 'horizontal' }
          else if(includes(val, 'column')) { prefixedProperties.WebkitBoxOrient = 'vertical' }
          break
        case 'alignSelf': prefixedProperties.msFlexItemAlign = valWithoutFlex(); break
        case 'alignItems': prefixedProperties.WebkitBoxAlign = prefixedProperties.msFlexAlign = valWithoutFlex(); break
        case 'alignContent':
          if(val === 'space-around') { prefixedProperties.msFlexLinePack = 'distribute' }
          else if(val === 'space-between') { prefixedProperties.msFlexLinePack = 'justify' }
          else { prefixedProperties.msFlexLinePack = valWithoutFlex() }
          break
        case 'justifyContent':          
          if(val === 'space-around') { prefixedProperties.msFlexPack = 'distribute' }
          else if(val === 'space-between') { prefixedProperties.WebkitBoxPack = prefixedProperties.msFlexPack = 'justify' }
          else { prefixedProperties.WebkitBoxPack = prefixedProperties.msFlexPack = valWithoutFlex() }
          break
        case 'flexBasis': prefixedProperties.msFlexPreferredSize = val; break
        case 'order':
          prefixedProperties.msFlexOrder = '-moz-calc(' + val + ')' //ugly hack to prevent react from adding 'px'
          prefixedProperties.WebkitBoxOrdinalGroup = '-webkit-calc(' + (parseInt(val) + 1) + ')' //this might not work for browsers who don't support calc
          break
        case 'flexGrow': prefixedProperties.WebkitBoxFlex = prefixedProperties.msFlexPositive = val; break
        case 'flexShrink': prefixedProperties.msFlexNegative = val; break
        case 'flex': prefixedProperties.WebkitBoxFlex = val; break
      }
    }

    Object.assign(styleObj, prefixedProperties)
  }

  //if valueWithPrefixes were not added before
  Object.keys(allPrefixedCssValues).forEach(cssKey=>{
    composePrefixedValues(allPrefixedCssValues[cssKey])
  })
  return styleObj
}


function autoPrefixer(obj, allVendors) {
  Object.keys(obj).forEach(key => 
    obj = checkAndAddPrefix({ ...obj }, key, obj[key], allVendors)
  )
  return obj
}

let isBrowser = typeof window !== 'undefined'

export function autoprefix(obj) {
  return autoPrefixer(obj, !isBrowser)
}
