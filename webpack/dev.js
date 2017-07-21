let webpack = require('webpack')
let path = require('path')
module.exports = {
  entry: './examples/index.js',
  output: {
    path: path.resolve('./examples'),
    filename: 'bundle.js'
  },
  module: {
    rules: [ {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        plugins: [ 
          path.join(__dirname, '../src/css/babel.js')
        ]
      }
    } ]  
  },
  resolve: {
    alias: {
      'glamor': '../src'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],
  devServer: {
    stats: 'errors-only',
    contentBase: 'examples/',
    historyApiFallback: true,
    compress: true, 
    inline: true
  }
}
