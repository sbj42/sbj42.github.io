/* eslint-env node */

module.exports = {
    entry: "./js/fpMain.js",
    devtool: 'source-map',
    output: {
        path: __dirname,
        filename: "dist/fp.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.json$/, loader: "json" },
            { test: /\.png$/, loader: "url?limit=25000&name=dist/png/[name].[ext]?[hash]" }
        ]
    }
};
