// unique feature 
// use for advanced perf/animations/whatnot 
// instead of overwriting, it replaces the rule in the stylesheet
export function keyed(key, type, style) {
  // todo - accept a style/rule? unlcear. 
  if(typeof key !== 'string') {
    throw new Error('whoops, did you forget a key?')
  }
  if(!style && typeof type === 'object') {
    style = type 
    type = undefined 
  }
  // should be able to pass a merged rule etc too 
  // maybe ...styles as well?
  return add(type, style, key)
}
