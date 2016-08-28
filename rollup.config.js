module.exports = {
  plugins: [
    require('rollup-plugin-babel')({
      presets: [ 'es2015-rollup', 'stage-0', 'react' ],
      plugins: [ 'transform-decorators-legacy' ],
      exclude: 'node_modules/**'
    })
  ]
}
