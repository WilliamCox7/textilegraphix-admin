const webpack = require('webpack');
const path = require('path');
const config = require('./config');

module.exports = {

  devtool: 'source-map',

  entry: [
    './client/index.js'
  ],

  output: {
    path: path.join(__dirname, '/build'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(config.env),
        'HOST': JSON.stringify(config.host)
      }
    })
  ],

  mode: 'production',

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
      test: /\.(ttf|eot|woff|woff2|mp4)$/,
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
