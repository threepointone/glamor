let webpack = require('webpack')

module.exports = {
  module: {
    rules: [ {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      options: {
        plugins: process.env.COVERAGE ? [ 'istanbul' ] : []
      }
    },
    {
      test: /\.json$/,
      use: 'json-loader'
    } ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'test')
    })
  ]      
}
