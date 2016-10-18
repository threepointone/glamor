let webpack = require('webpack')

module.exports = {
  module: {
    loaders: [ {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: [ [ 'es2015', { modules: false } ], 'stage-0', 'react' ]
      }
    } ]  
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]      
}
