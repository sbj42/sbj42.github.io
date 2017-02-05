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
        extensions: ['.js', '.ts', '.css']
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
            }
        ]
    }
};
