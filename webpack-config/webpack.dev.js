
const webpack = require('webpack')
const opn = require('opn')
const webpackDevServer = require('webpack-dev-server')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const ora = require('ora')
const webpackBase = require('./webpack.base.js')

const port = 8080
const uri = 'http://localhost:' + port

const spinner = ora('compiling...')

const webpackConfig = merge(webpackBase, {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    // 跳过编译时出错的代码并记录
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new webpack.ProgressPlugin((percentage) => {
      if (percentage === 0) {
        spinner.start()
      } else if (percentage === 1) {
        spinner.stop()
      } else {
        spinner.text = 'compiling ' + percentage * 100 + '%'
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin()
  ]
})

Object.keys(webpackConfig.entry).forEach((name) => {
  webpackConfig.entry[name] = [
    'webpack-dev-server/client?' + uri,
    'webpack/hot/dev-server'
  ].concat(webpackConfig.entry[name])
})

const compiler = webpack(webpackConfig)

const server = new webpackDevServer(compiler, {
  publicPath: webpackConfig.output.publicPath,
  hot: true,
  quiet: true,
  overlay: true
})

server.listen(port, function (err) {
  if (err) {
    console.error(err)
    return
  }
  opn(uri)
})
