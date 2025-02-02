const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: "./scripts/main.js",
    schedule: "./scripts/schedule.js",
    list: "./scripts/list.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      chunks: ["main"],
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      template: "./schedule.html",
      chunks: ["schedule"],
      filename: "schedule.html",
    }),
    new HtmlWebpackPlugin({
      template: "./list.html",
      chunks: ["list"],
      filename: "list.html",
    }),
  ],
  devServer: {
    static: "./dist",
    port: 9000,
  },
};