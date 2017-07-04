let webpack = require('webpack')
let path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('./src'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      // query: {
      //   plugins: [ 
      //     path.join(__dirname, 'node_modules', 'glamor-raw-css', 'babel')
      //   ]
      // }
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],
  devServer: {
    stats: 'errors-only',
    contentBase: 'src/',
    historyApiFallback: true,
    compress: true,
    inline: true
  }
}
