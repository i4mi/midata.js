var path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: './dist',
        filename: 'midata.js'
    },
    devtool: 'eval-source-map',
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
