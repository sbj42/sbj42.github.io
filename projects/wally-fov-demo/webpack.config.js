var path = require('path');

module.exports = {
    entry: "./src/demo.ts",
    devtool: 'source-map',
    target: 'web',
    output: {
        path: path.join(__dirname, "build"),
        filename: "demo.js"
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [ 'ts-loader' ]
            }
        ]
    }
};
