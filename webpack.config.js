const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StyleLintPlugin = require('stylelint-webpack-plugin');
var WebpackNotifierPlugin = require('webpack-notifier');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const path = require('path');
const webpack = require("webpack");

let templates = [];
let dir = 'app/View/Pug/Pages';
let files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.match(/\.pug$/)) {
    let filename = file.substring(0, file.length - 4);
    templates.push(
      new HtmlWebpackPlugin({
        template: dir + '/' + filename + '.pug',
        filename: filename + '.html',
        'meta': {
          'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=yes',
        }
      })
    );
  }
});

module.exports = {
  entry: [
    './app/webroot/js/main.js',
    './app/webroot/scss/main.scss'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader'
        }
      },
      {
        test: /\.pug$/,
        use: [
          "raw-loader",
          "pug-html-loader"
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insertAt: 'top',
              singleton: true
            }
          },
          "css-loader"
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          'url-loader',
          'file-loader'
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]",
          },
        },
      },
    ]
  },
  plugins: [
    ...templates,
    new HtmlWebpackPugPlugin(),
    new MiniCssExtractPlugin({
      filename: "app/webroot/css/main.css"
    }),
    new StyleLintPlugin({
      configFile: ".stylelintrc"
    }),
    new WebpackNotifierPlugin(),
    new CopyWebpackPlugin([
      { from: 'app/webroot/img', to: 'img' },
    ]),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    })
  ]
}
