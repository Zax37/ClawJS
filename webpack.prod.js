const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    plugins: [
        //new UglifyJsPlugin({parallel: true, sourceMap: true, extractComments: true})
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.js'
    },
    mode: 'production'
});
