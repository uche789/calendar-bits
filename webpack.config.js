const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV || 'production',
    watch: process.env.NODE_ENV === 'development' ? true : false,
    entry: {
        calendarBits: './src/index.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            { 
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
        ]
    },
    output: {
        publicPath: '/',
        library: 'ClndrBits',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist'),
        globalObject: 'this',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    devtool: 'source-map'
}