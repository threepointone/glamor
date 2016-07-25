module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'mocha'],
    browsers: ['PhantomJS'],
    reporters: ['mocha'],
    preprocessors: {
      'index.js': [ 'browserify' ]
    },
    files: ['index.js']
  });
};
