let webpack = require('webpack');
let path = require('path');

const umdDefaults = {
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
    path: path.join(process.cwd(), 'umd'),
    library: 'Glamor',
    libraryTarget: 'umd',
    filename: 'index.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'test')
    })
  ]
};

module.exports = [
  umdDefaults,
  Object.assign(
    {},
    umdDefaults,
    {
      output: Object.assign(
        {},
        umdDefaults.output,
        {
          filename: 'index.min.js'
        }),
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': 'production'
        }),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        })
      ]
    })
];
