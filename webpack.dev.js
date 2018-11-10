const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  devtool: 'source-map',
  output: {
    publicPath: '/'
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'resources'),
    publicPath: '/',
    hot: true,
    host: 'localhost'
  },
  mode: 'development'
});
