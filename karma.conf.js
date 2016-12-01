var webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
    config.set({
        // Base path that will be used to resolve file patterns.
        basePath: '.',
        frameworks: ['jasmine'],
        // Files to load in the browser.
        files: [
            'src/**/*.spec.ts'
        ],
        webpack: {
            debug: true,
            module: webpackConfig.module,
            resolve: webpackConfig.resolve
        },
        webpackMiddleware: {
            quiet: true,
            stats: {
                colors: true
            }
        },
        // Preprocess matching files before serving them to the browser
        preprocessors: {
            'src/**/*.ts': ['webpack']
        },
        logLevel: config.LOG_INFO,
        reporters: ['mocha'],
        colors: true,
        browsers: ['PhantomJS'],
        autoWatch: true,
        singleRun: false
    });
};
