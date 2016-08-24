/* 

high performance StyleSheet for css-in-js systems 

- uses multiple style tags behind the scenes for millions of rules 
- uses `insertRule` for appending in production for *much* faster performance
- 'polyfills' on server side 


// usage

import StyleSheet from 'glamor/lib/sheet'
let styleSheet = new StyleSheet({ 
  name: 'mySheet', // optional
  length: 30000 // defaults to 4000 for IE9, 65000 otherwise 
})

styleSheet.inject() 

// 'injects' the stylesheet into the page (or into memory if on server)

styleSheet.insert('#box { border: 1px solid red; }') 

// appends a css rule into the stylesheet 

styleSheet.rules()

// array of css rules 
// use for server side rendering, etc 

styleSheet.flush() 

// empties the stylesheet of all its contents


*/

/**** stylesheet ****/

function last() {
  return this[this.length -1]
}

function sheetForTag(tag) {
  for(let i = 0; i < document.styleSheets.length; i++) {
    if(document.styleSheets[i].ownerNode === tag) {
      return document.styleSheets[i]
    }
  }
}

const isBrowser = typeof document !== 'undefined' 
const isDev = (x => (x === 'development') || !x)(process.env.NODE_ENV)
const isTest = process.env.NODE_ENV === 'test' 

let sheetCounter = 0

function makeStyleTag(name = '_css_') {
  let tag = document.createElement('style')        
  tag.type = 'text/css'
  tag.id = name
  tag.setAttribute('id', name)
  tag.appendChild(document.createTextNode(''));
  (document.head || document.getElementsByTagName('head')[0]).appendChild(tag)
  return tag
}

export class StyleSheet {
  constructor({ name = '_css_' + sheetCounter++, speedy = !isDev && !isTest, length = 30000 }) { // somehow default to 60000
    this.name = name 
    this.speedy = speedy // the big drawback here is that the css won't be editable in devtools
    this.sheet = undefined
    this.tags = []
    this.length = length
    this.ctr = 0
  }
  inject() {
    if(this.injected) {
      throw new Error('already injected stylesheet!') //eslint-disable-line no-console
    }
    if(isBrowser) {
      // this section is just weird alchemy I found online off many sources 
      this.tags[0] = makeStyleTag(this.name + this.ctr)        
      // this weirdness brought to you by firefox 
      this.sheet = sheetForTag(this.tags[0]) 
    } 
    else {
      // server side 'polyfill'. just enough behavior to be useful.
      this.sheet  = {         
        cssRules: [],
        insertRule: rule => {
          // enough 'spec compliance' to be able to extract the rules later  
          // in other words, just the cssText field 
          this.sheet.cssRules.push({ cssText: rule }) 
        }
      }
    } 
    this.injected = true
  }
  _insert(rule) {
    // this weirdness for perf, and chrome's weird bug 
    // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule

    try {          
      this.sheet.insertRule(rule, this.sheet.cssRules.length) // todo - correct index here     
    }
    catch(e) {
      if(isDev) {
        // might need beter dx for this 
        console.warn('whoops, illegal rule inserted', rule) //eslint-disable-line no-console
      }          
    }          

  }
  insert(rule) {    
    // more browser weirdness. I don't even know
    if(this.tags.length > 0 && this.tags::last().styleSheet) {
      this.tags::last().styleSheet.cssText+= rule
    }
    else {
      if(isBrowser) {
        // here goes the logic for 
        if(this.speedy && this.sheet.insertRule) {        
          this._insert(rule)
        }
        else{
          this.tags::last().appendChild(document.createTextNode(rule))

          // todo - more efficent here please 
          if(!this.speedy) {
            // sighhh
            this.sheet = sheetForTag(this.tags::last())
          }      
        }      
      }
      else{
        // server side is pretty simple         
        this.sheet.insertRule(rule)
      }
    }
    this.ctr++
    if(this.ctr % this.length === 0) {
      this.tags.push(makeStyleTag(this.name + Math.round(this.ctr / this.length)))
      this.sheet = sheetForTag(this.tags::last())
    }
    // if ctr at border 
    // add new tag 
    // reassign sheet 
    // ctr++ ? 
  }
  flush() {
    // todo backward compat (styleTag.styleSheet.cssText?)
    if(isBrowser) {
      this.tags.forEach(tag => tag.parentNode.removeChild(tag))
      this.tags = []
      this.sheet = null
      // todo - look for remnants in document.styleSheets
    }
    else {
      // simpler on server 
      this.sheet.cssRules = []
    }
    this.injected = false
  }  
  rules() {
    if(!isBrowser) {
      return Array.from(this.sheet.cssRules)
    }
    return this.tags.reduce((arr, tag) => 
      arr.concat(Array.from(
        sheetForTag(tag).cssRules 
      )), [])
    
  }
}
