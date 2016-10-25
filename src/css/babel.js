// a babel plugin that strips out the tagged literal syntax,
// and replaces with a json form. everybody wins!
// we can do this because we control the ast
// and there's a corresponding json representation for every kv pair / nesting form

// replace interpolations with stubs
// parse to get intermediate form
// print back, replacing stubs with interpolations
// tada?

let template = require('babel-template')


module.exports = {
  visitor: {
    TaggedTemplateExpression(path) {
      let cssStr = path.node.quasi.
      path.replaceWithSourceString(`css2(${JSON.stringify(intermediate)})`)
    }    
  }
}
