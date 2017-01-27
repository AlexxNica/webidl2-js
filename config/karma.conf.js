// Karma configuration

const execSync = require('child_process').execSync;

const FOAM_DIR = `${__dirname}/../node_modules/foam2-experimental`;

// Outputs ../node_modules/foam2-experimental/foam-bin.js
execSync(`node ${FOAM_DIR}/tools/build.js web`);

const basePath = `${__dirname}/../test`;
const deps = ['../node_modules/foam2-experimental/foam-bin.js'];
const entries = [
  '../src/diff.js',
  '../src/outputer.js',
  '../src/parser.js',
  '../test/browser/webidl2.js',
];
const helpers = [
  'any/**/*-helper*.js',
  'browser/**/*-helper*.js',
];
const units = [
  'any/**/*-test*.js',
  'browser/**/*-test*.js',
];
const integrations = [
  'any/**/*-integration*.js',
  'browser/**/*-integration*.js',
];
const reporters = ['progress'];
const preprocessors = entries.reduce((acc, key) => {
  acc[key] = ['webpack'];
  return acc;
}, {});

function configurator(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: deps,

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters,

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors,

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // start these browsers
    // available browser launchers:
    // https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // enable / disable watching file and executing tests whenever any file
    // changes
    autoWatch: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  });
};

configurator.deps = deps;
configurator.entries = entries;
configurator.helpers = helpers;
configurator.units = units;
configurator.integrations = integrations;

module.exports = configurator;