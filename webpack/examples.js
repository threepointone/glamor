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
      loader: 'babel',
      query: {
        plugins: [ 
          path.join(__dirname, '../packages/glamor-raw-css/src/babel.js')
        ]
      }
    } ]  
  },
  resolve: {
    alias: {
      'glamor': '../packages/glamor',
      'glamor-reset': '../packages/glamor-reset',
      'glamor-ous': '../packages/glamor-ous',
      'glamor-aphrodite': '../packages/glamor-aphrodite',
      'glamor-jsxstyle': '../packages/glamor-jsxstyle',
      'glamor-react': '../packages/glamor-react',
      'glamor-styled': '../packages/glamor-styled'
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
