module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'mocha'],
    browsers: ['PhantomJS'],
    preprocessors: {
      'tests/index.js': [ 'browserify' ]
    },
    files: ['tests/index.js']
  });
};
