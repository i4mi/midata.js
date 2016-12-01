var path = require('path');

module.exports = {
    context: __dirname + '/src',
    entry: './index.ts',
    output: {
        path: __dirname + '/dist',
        filename: 'midata.js',
        libraryTarget: 'var',
        library: 'midata'
    },
    devtool: 'source-map',
    resolve: {
        extensions: [ '', '.ts', '.js' ]
    },
    alias: {
        '@midata': path.resolve('./src')
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader?logLevel=warn' }
        ]
    }
};
