var allBrowsers = process.env.ALL

module.exports = function (config) {
  config.set({
    frameworks: [ 'browserify', 'mocha' ],
    browsers: allBrowsers ? [ 'PhantomJS', 'Firefox', 'Chrome', 'Safari' ] : [ 'PhantomJS' ],
    reporters: [ 'mocha' ],
    preprocessors: {
      'index.js': [ 'browserify' ]
    },
    files: [ 'index.js' ],
    browserify: {
      transform: [ [
        'babelify', {
          presets: [ 'es2015', 'stage-0', 'react' ]
        }
      ], 'envify' ]
    }
  })
}
