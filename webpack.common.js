const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // otomatis bersihkan dist sebelum build baru
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),

    new CopyWebpackPlugin({
      patterns: [
        // ✅ 1. Salin service worker ke root dist
        { from: path.resolve(__dirname, 'public/sw.js'), to: '' },

        // ✅ 2. Salin seluruh isi folder src/public ke root dist
        // (agar manifest.json & favicon.png bisa diakses langsung)
        { from: path.resolve(__dirname, 'src/public'), to: '' },

        { from: path.resolve(__dirname, 'src/manifest.json'), to: '' },
      ],
    }),
  ],
};
