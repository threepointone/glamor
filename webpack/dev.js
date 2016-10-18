let webpack = require('webpack')
module.exports = {
  entry: './examples/index.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
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
  ],
  devServer: {
    contentBase: 'examples/',
    historyApiFallback: true,
    compress: true, 
    inline: true
  }
}
