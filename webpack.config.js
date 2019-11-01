// @ts-check
const HtmlWebpackPlugin = require("html-webpack-plugin")

/** @type {import('webpack').Configuration} */
const config = {
  entry: "./src/main.ts",
  output: {
    path: `${__dirname}/build`,
    filename: `[name].[hash:8].js`,
  },
  module: {
    rules: [{ test: /\.tsx?$/, use: "babel-loader" }],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  plugins: [new HtmlWebpackPlugin({ template: "src/index.html" })],
  mode: "development",
}

module.exports = config
