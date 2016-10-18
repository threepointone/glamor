let webpack = require('webpack')

module.exports = {
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
      loader: 'babel-loader'
    } ]  
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
}
