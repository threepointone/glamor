let webpack = require('webpack')
let path = require('path')

module.exports = {  
  devtool: 'source-map',  
  entry: './src/index.js',
  output: {
    library: 'Glamor',
    libraryTarget: 'umd',
    path: path.resolve('./umd'),
    filename: 'index.js'
  },
  module: {
    rules: [ {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    } ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}

if(process.env.NODE_ENV === 'production') {  
  module.exports.output.filename = 'index.min.js' 
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: true, mangle: true, sourceMap: true }))
} 

