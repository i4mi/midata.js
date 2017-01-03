module.exports = {
    entry: __dirname + '/src/index.ts',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: [ '', '.ts', '.js' ]
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader?logLevel=warn' }
        ]
    }
};
