const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.ts'),
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      templateParameters: {
        webglRenderer: process.env.WEBGL_RENDERER === 'true',
        canvasRenderer: process.env.CANVAS_RENDERER === 'true'
      }
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
};
