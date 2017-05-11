let webpack = require('webpack')
let path = require('path')

module.exports = {
  entry: './tests/index.ts',
  module: {
    loaders: [
      {
       test: /\.tsx?$/, 
       use: [{loader:'ts-loader'}]       
      }
    ],
  },
  resolve:{
    extensions:['.ts', '.tsx','.js', '.jsx']
  },
  output:{
    path:path.join(process.cwd(), 'dist-tests') ,
    filename:'index.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'test')
    })
  ]      
}
