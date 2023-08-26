const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",  // 开发模式
  devtool: "eval-source-map",  // 便于调试
  entry: "./src/index.js",  // 入口文件
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,  // 排除第三方模块
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|mp3|jpe?g)$/i,
        use: "file-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "../")  // 清理输出目录
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: "./index.html"  // 模版生成的输出文件
    })
  ]
};
