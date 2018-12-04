const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = {

  devtool: 'source-map',

  entry: [
    './client/index.js'
  ],

  output: {
    path: path.join(__dirname, '/build/admin'),
    filename: 'bundle.js',
    publicPath: '/admin/'
  },

  mode: 'production',

  optimization: {
    minimizer: [new UglifyJsPlugin()]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],

  module: {
    rules: [{
      test: /\.js?$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.scss$/,
      loader: 'style-loader!css-loader!sass-loader'
    }, {
      test: /\.(jpg|png|svg)$/,
      loader: 'file-loader'
    }, {
      test: /\.(ttf|eot|woff|woff2)$/,
      loader: 'file-loader'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },

  resolve: {
    extensions: [".js", ".css"]
  }

}
