// let isCloud = process.env.USE_CLOUD
var allBrowsers = process.env.ALL

module.exports = function (config) {
  config.set({
    frameworks: [ 'browserify', 'mocha' ],
    browsers: allBrowsers ? [ 'PhantomJS', 'Firefox', 'Chrome', 'Safari' ] : [ 'PhantomJS' ],
    reporters: [ 'mocha' ],
    preprocessors: {
      'index.js': [ 'browserify' ]
    },
    files: [ 'index.js' ]
  })
}
