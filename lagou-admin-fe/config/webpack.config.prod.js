// 1、加版本号： CSS + JS
// 2、抽离CSS
// 3、production

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
require("@babel/polyfill")

module.exports = {
  // 模式
  mode: 'production',

  entry: {
    app: ['@babel/polyfill', './src/scripts/app.js']
  },

  // 出口
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'scripts/[name]-[hash:6].js'
  },

  // loaders: 用于对模块的源代码进行转换
  // 多个loader加载的时候，注意顺序
  module: {
    rules: [{
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'sass-loader'
          }]
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader', // 基于file-loader
          options: {
            // limit 定义是否做base64编码的边界值
            limit: 1000,
            name: '[name].[ext]',
            outputPath: 'assets/images'
          }
        }]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: 'string-loader'
        }
      }
    ]
  },

  // 插件：plugins,增强webpack的能力
  plugins: [
    // copy html并且导入入口文件
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    }),

    //拷贝文件
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../public'),
      to: path.resolve(__dirname, '../dist/public')
    }]),

    new ExtractTextPlugin("styles/[name]-[hash:6].css")
  ],

  // 模块名和外链文件对象的一个映射
  externals: {
    // 'jquery': 'window.jQuery'
  }
}