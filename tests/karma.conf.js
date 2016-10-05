var allBrowsers = process.env.ALL
var projectName = require('../package').name

const customLaunchers = {
  BS_Chrome: {
    base: 'BrowserStack',
    os: 'Windows',
    os_version: '10',
    browser: 'chrome',
    browser_version: '47.0'
  },
  BS_Firefox: {
    base: 'BrowserStack',
    os: 'Windows',
    os_version: '10',
    browser: 'firefox',
    browser_version: '43.0'
  },
  BS_Safari: {
    base: 'BrowserStack',
    os: 'OS X',
    os_version: 'El Capitan',
    browser: 'safari',
    browser_version: '9.0'
  },
  BS_MobileSafari8: {
    base: 'BrowserStack',
    os: 'ios',
    os_version: '8.3',
    browser: 'iphone',
    real_mobile: false
  },
  BS_MobileSafari9: {
    base: 'BrowserStack',
    os: 'ios',
    os_version: '9.1',
    browser: 'iphone',
    real_mobile: false
  },
  BS_InternetExplorer9: {
    base: 'BrowserStack',
    os: 'Windows',
    os_version: '7',
    browser: 'ie',
    browser_version: '9.0'
  },
  BS_InternetExplorer10: {
    base: 'BrowserStack',
    os: 'Windows',
    os_version: '8',
    browser: 'ie',
    browser_version: '10.0'
  },
  BS_InternetExplorer11: {
    base: 'BrowserStack',
    os: 'Windows',
    os_version: '10',
    browser: 'ie',
    browser_version: '11.0'
  }
}

module.exports = function (config) {
  config.set({    
    frameworks: [ 'browserify', 'mocha' ],
    browsers: allBrowsers ? [ 'PhantomJS', 'Firefox', 'Chrome', 'Safari', 'MobileSafari' ] : [ 'PhantomJS' ],
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

  if (process.env.USE_CLOUD) {
    config.customLaunchers = customLaunchers
    config.browsers = Object.keys(customLaunchers)
    config.reporters = [ 'dots' ]
    config.concurrency = 2

    config.browserDisconnectTimeout = 10000
    config.browserDisconnectTolerance = 3

    if (process.env.TRAVIS) {
      config.browserStack = {
        project: projectName,
        build: process.env.TRAVIS_BUILD_NUMBER,
        name: process.env.TRAVIS_JOB_NUMBER
      }

      config.singleRun = true
    } else {
      config.browserStack = {
        project: projectName
      }
    }
    
  }
}
