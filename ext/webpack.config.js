const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const manifestFileName = process.env.BROWSER === 'firefox' ? 'manifest_firefox.json' : 'manifest_chrome.json';

module.exports = {
  entry: {
    popup: './src/popup/index.js',
    contentScript: './src/contentScript.js',
    background: './src/background.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/popup/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `src/${manifestFileName}`, to: 'manifest.json' },
        { from: 'public/icons', to: 'icons' }, // Si vous avez des icônes
      ],
    }),
    new webpack.DefinePlugin({
      'process.env.BROWSER': JSON.stringify(process.env.BROWSER),
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
