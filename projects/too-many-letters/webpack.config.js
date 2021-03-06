/* eslint-env node */
var path = require('path');

module.exports = {
    entry: "./src/index.ts",
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: "tml.js"
    },
    resolve: {
        extensions: ['.js', '.ts', '.css', '.ogg', '.txt'],
        fallback: { 'crypto': false }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.tsx?$/,
                use: [ 'ts-loader' ]
            },
            {
                 test: /\.(svg|jpg|ogg)$/,
                 loader: "url-loader",
                 options: {
                     limit: 100000,
                     name: "dist/img/[name].[ext]?[hash]"
                 }
            },
            {
                 test: /\.txt$/,
                 loader: "raw-loader"
            }
        ]
    }
};
