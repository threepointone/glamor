/* 

high performance StyleSheet for css-in-js systems 

- uses `insertRule` in production for *much* faster performance
- 'polyfills' on server side in memory 

// usage
import StyleSheet from 'glamor/lib/sheet'
let styleSheet = new StyleSheet()

OR 

// pass a custom name/id for tag, and toggle insertRule manually 
let styleSheet = new StyleSheet({ name, speedy = true/false })

styleSheet.inject() 
// 'injects' the stylesheet into the page (or into memory if on server)

styleSheet.insert('#box { border: 1px solid red; }' [, index]) 
// inserts a css rule into the stylesheet 

styleSheet.sheet.cssRules // arrayLike collection of css rules 

styesheet.remove(index)
// remove rule at position `index`

styleSheet.flush() 
// empties the stylesheet of all its contents


*/

/**** stylesheet ****/

const isBrowser = typeof document !== 'undefined' 
const isDev = (x => (x === 'development') || !x)(process.env.NODE_ENV)
const isTest = process.env.NODE_ENV === 'test' 

let tagCounter = 0

export class StyleSheet {
  constructor({ name = '_css_' + tagCounter++, speedy = !isDev && !isTest }) {
    this.name = name 
    this.speedy = speedy // the big drawback here is that the css won't be editable in devtools
    this.sheet = undefined
    this.tag = undefined     
  }
  inject() {
    if(this.injected) {
      throw new Error('already injected stylesheet!') //eslint-disable-line no-console
    }
    if(isBrowser) {
      // this section is just weird alchemy I found online off many sources 
      // it checks to see if the tag exists; creates an empty one if not 
      this.tag = document.getElementById(this.name)
      if(!this.tag) {
        let tag = document.createElement('style')
        
        tag.type = 'text/css'
        tag.id = this.name
        tag.setAttribute('id', this.name)
        tag.appendChild(document.createTextNode(''));
        (document.head || document.getElementsByTagName('head')[0]).appendChild(tag)
        this.tag = tag
      }
      // this weirdness brought to you by firefox 
      this.sheet = [ ...document.styleSheets ].filter(x => x.ownerNode === this.tag)[0]  
    }
    else {
      // server side 'polyfill'. just enough behavior to be useful.
      this.sheet  = { 
        cssRules: [],
        deleteRule: index => {
          this.sheet.cssRules = [ ...this.sheet.cssRules.slice(0, index), ...this.sheet.cssRules.slice(index + 1) ]
        },
        insertRule: (rule, index = this.sheet.cssRules.length) => {
          // enough 'spec compliance' to be able to extract the rules later  
          // in other words, just the cssText field 
          this.sheet.cssRules = [ ...this.sheet.cssRules.slice(0, index), { cssText: rule }, ...this.sheet.cssRules.slice(index) ]
        }
      }
    } 
    this.injected = true
  }
  _insert(rule, index) {
    // this weirdness for perf, and chrome's weird bug 
    // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule

    try {          
      this.sheet.insertRule(rule, index)    
    }
    catch(e) {
      if(isDev) {
        // might need beter dx for this 
        console.warn('whoops, illegal rule inserted', rule) //eslint-disable-line no-console
      }          
    }          

  }
  insert(rule, index = this.sheet.cssRules.length) {
    // more browser weirdness. I don't even know
    if(this.tag && this.tag.styleSheet) {
      this.tag.styleSheet.cssText+= rule
    }
    else {
      if(isBrowser) {       
        if(this.speedy && this.sheet.insertRule) {        
          this._insert(rule, index)
        }
        else{
          this.tag.appendChild(document.createTextNode(rule))
          // todo - more efficent here please 
          if(!this.speedy) {
            // sighhh
            this.sheet = [ ...document.styleSheets ].filter(x => x.ownerNode === this.tag)[0]  
          }      
        }      
      }
      else{
        // server side is pretty simple 
        this.sheet.insertRule(rule, index)
      }
    }
  }
  flush() {
    // todo backward compat (styleTag.styleSheet.cssText?)
    if(isBrowser) {
      this.tag && this.tag.parentNode.removeChild(this.tag)
      this.tag = null
      // todo - look for remnants in document.styleSheets
      // this.inject()
    }
    else {
      // simpler on server 
      this.sheet.cssRules = []
    }
    this.injected = false
  }
  remove(i) {
    // todo - tests
    if(this.speedy || !isBrowser) {
      this.sheet.deleteRule(i)
    }
    else {           
      this.tag.removeChild(this.stag.childNodes[i + 1]) // the +1 to account for the blank node we added
      // reassign stylesheet, because firefox is weird 
      this.sheet = [ ...document.styleSheets ].filter(x => x.ownerNode === this.tag)[0]
    }
  }
}
