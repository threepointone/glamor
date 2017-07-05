let webpack = require('webpack');
let path = require('path');
let FixDefaultImportPlugin = require('webpack-fix-default-import-plugin');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  output: {
    path: path.join(process.cwd(), 'lib'),
    libraryTarget: 'commonjs',
    filename: 'index.js'
  },
  externals: /^[^.]/,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'test')
    }),
    new FixDefaultImportPlugin()
  ]
};
