var path = require('path');

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  module: {
      rules: [
          {
              test: /\.css$/,
              use: ['style-loader', 'css-loader']
          }
      ]
  },
  output: {
    filename: 'storylib.js',
    path: path.resolve(__dirname, 'dist')
  }
};