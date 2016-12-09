const webpack = require('webpack');
const path = require('path');
const PROD = JSON.parse(process.env.PROD || '0');


module.exports = {
    entry: __dirname + '/src/index.ts',
    output: {
        path: __dirname + '/dist',
        filename: 'midata.js',
        library: 'midata',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devtool: 'source-map',
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
    },
    plugins: PROD ? [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            // sourceMap: true,
            output: {
                comments: false
            },
            compress: { warnings: false }
        })
    ] : []
};
