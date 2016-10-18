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
  devServer: {
    contentBase: 'examples/',
    historyApiFallback: true,
    compress: true, 
    inline: true
  }
}
