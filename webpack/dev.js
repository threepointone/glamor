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
      loader: 'babel-loader',
      query: {
        presets: [ 'es2015', 'stage-0', 'react' ],
        plugins: [ 'transform-decorators-legacy' ]
      }
    } ]  
  },
  devServer: {
    contentBase: 'examples/',
    historyApiFallback: true,
    compress: true, 
    inline: true
  }
}
