/* eslint-disable global-require */
// https://github.com/karma-runner/karma/issues/1597
const path = require('path');

module.exports = function configureKarma(config) {
  config.set({
    frameworks: ['mocha'],
    files: [
      'test/index.spec.js',
    ],

    preprocessors: {
      'test/index.spec.js': ['webpack'],
    },

    reporters: ['spec', 'coverage'],

    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
    },

    webpack: {
      // webpack configuration
      module: {
        preLoaders: [{
          test: /\.js$/,
          include: [
            path.resolve(__dirname, './index.js'),
            path.resolve(__dirname, './implements.js'),
          ],
          loader: 'istanbul-instrumenter',
        }],
      },

      devtool: 'cheap-module-source-map',
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      noInfo: true,
    },

    client: {
      mocha: {
        // change Karma's debug.html to the mocha web reporter
        reporter: 'html',

        // require specific files after Mocha is initialized
        require: [require.resolve('bdd-lazy-var/bdd_lazy_var_global')],

        // custom ui, defined in required file above
        ui: 'bdd-lazy-var/global',
      },
    },

    plugins: [
      require('karma-webpack'),
      require('istanbul-instrumenter-loader'),
      require('karma-mocha'),
      require('karma-coverage'),
      require('karma-phantomjs-launcher'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-spec-reporter'),
    ],

    browsers: ['PhantomJS', 'Chrome', 'Firefox', 'ChromeCanary'],
  });
};
