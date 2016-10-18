let webpack = require('webpack')

exports = {  
  entry: './src/index.js',
  output: {
    library: 'Glamor',
    libraryTarget: 'umd',
    path: './umd',
    filename: 'index.js'
  },
  module: {
    loaders: [ {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    } ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
}

if(process.env.NODE_ENV === 'production') {  
  exports.output.filename = 'index.min.js' 
  exports.plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: true, mangle: true }))
} 
else {
  exports.devtool = 'source-map'  
}
