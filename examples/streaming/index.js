let ReactDOMNodeStream = require('react-dom/node-stream')
let React = require('react')

let { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

let through = require('through')


let stream = through(function write(data){
  console.log(decoder.write(data))
  this.queue(data)
}, function end(data){
  this.queue(null)
})




ReactDOMNodeStream.renderToStream(<div className='asasdasd'>
  woah there 
  <span>
    hello world  
  </span>  
  {Array.from({ length: 1000 }).map(i => <span>what what</span>)}
</div>).pipe(stream)