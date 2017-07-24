// WARNING - this is just a sketch, from some previous work. 
// has yet to be modified for react v16

import through from 'through'

import { styleSheet } from '../src'

function toTag(ids){  
  let idhash = ids.reduce((o, x) => (o[x + ''] = true, o), {})
  let rules = styleSheet.rules().filter(x => {
    let regex = /css-([a-zA-Z0-9]+)/gm
    let match = regex.exec(x.cssText)
    if(match && idhash[match[1] + '']) {
      return true
    }    
    return false
  })

  return `<style>${rules.map(x => x.cssText).join('')}</style>`
}

function matches(str){
  let regex = /css-([a-zA-Z0-9]+)/gm
  let match, arr = []
  while((match = regex.exec(str)) !== null){
    arr.push(match[1])
  }
  return arr 
}

export default function inline(){
  let result = [], ids = [], buffering = false
  let insed = {}
  let stream = through(function(data){
    let str = data.toString()
    if(str.charAt(0) === '<' ){
      buffering = true      
      result.push(str)
    }
    else if((buffering === true) && (str === '>')){      
      buffering = false
      result.push(str)
      
      ids.forEach(x => insed[x + ''] = true)
      if(ids.length > 0){
        // flush css 
        this.queue(toTag(ids))  
      }
      
      this.queue(result.join(''))
      ids = []
      result = []
    }
    else if(buffering === true){
      let arr = matches(str).filter(x => !insed[x + ''])   
      ids = [...ids, ...arr] 
      
      result.push(str)
    }
    else {
      this.queue(str)  
    }
    
  }, function(){
    if(result.length > 0){
      let last = result.join('')
      this.queue(last)
    }

    this.queue(null)
  })
  return stream
}