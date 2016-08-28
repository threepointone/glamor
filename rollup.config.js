module.exports = {
  plugins: [
    require('rollup-plugin-babel')({
      presets: [ 'es2015-rollup', 'stage-0', 'react' ],
      plugins: [ 'transform-decorators-legacy', 'external-helpers' ],
      exclude: 'node_modules/**'
    })
  ]
}
