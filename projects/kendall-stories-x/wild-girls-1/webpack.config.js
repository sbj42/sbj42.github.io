var path = require('path');

module.exports = {
  entry: './src/story.js',
  devtool: 'source-map',
  module: {
      rules: [
          {
              test: /\.css$/,
              use: ['style-loader', 'css-loader']
          },
          {
              test: /\.txt$/,
              use: ['raw-loader']
          }
      ]
  },
  output: {
    filename: 'story.js',
    path: path.resolve(__dirname, 'dist')
  }
};