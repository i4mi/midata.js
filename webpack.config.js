var path = require('path');

module.exports = {
    entry: __dirname + '/src/index.ts',
    output: {
        path: __dirname + '/dist',
        filename: 'midata.js',
        library: 'midata',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devtool: 'eval-source-map',
    resolve: {
        extensions: [ '', '.ts', '.js' ],
        alias: {
            '@midata': path.resolve('./src')
        }
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader?logLevel=warn' }
        ]
    }
};
