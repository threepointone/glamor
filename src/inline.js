import { styleSheet } from './index'

function toTag(ids){  
  let idhash = ids.reduce((o, x) => (o[x + ''] = true, o), {})
  let rules = styleSheet.rules().filter(x => {
    let regex = /css\-([a-zA-Z0-9\_\-]+)/gm
    let match = regex.exec(x.cssText)
    if(match && idhash[match[1] + '']) {
      return true
    }    
    return false
  })
  return `<style>${rules.map(x => x.cssText).join('')}</style>`
}

export default function inline(html){
  let regex = /\<|css\-([a-zA-Z0-9]+)/gm

  let match, lastBackIndex = 0, idBuffer = [], result = [], insed = {}

  let plain = styleSheet.rules().filter(x => !(/css\-([a-zA-Z0-9\_\-]+)/gm.exec(x.cssText)));
  (plain.length > 0) && result.push(`<style>${plain.map(x => x.cssText).join('')}</style>`)

  while((match = regex.exec(html)) !== null){
    if(match[0] === '<'){
      idBuffer = idBuffer.filter(x => !insed[x]);
      (idBuffer.length > 0) && result.push(toTag(idBuffer))
      result.push(html.substring(lastBackIndex, match.index))
      lastBackIndex = match.index 
      idBuffer.forEach(x => insed[x] = true)      
      idBuffer = []
    }
    else {
      idBuffer.push(match[1])
    }
    
  }
  result.push(html.substring(lastBackIndex, html.length))
  return result.join('')
}