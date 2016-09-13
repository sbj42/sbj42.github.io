/* eslint-env node */
var path = require('path');

module.exports = {
    entry: "./js/main.js",
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "dist.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.json$/, loader: "json" },
            { test: /\.png$/, loader: "url?limit=25000" }
        ]
    }
};
