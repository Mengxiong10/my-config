
const webpack = require('webpack')
const opn = require('opn')
const webpackDevServer = require('webpack-dev-server')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const webpackBase = require('./webpack.base.js')

const port = 8080
const uri = 'http://localhost:' + port 

const webpackConfig = merge(webpackBase,{
  devtool:'#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': '"development"'
    }),
    new webpack.HotModuleReplacementPlugin(),
    //跳过编译时出错的代码并记录
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin(),
  ]
})

Object.keys(webpackConfig.entry).forEach((name) => {
  webpackConfig.entry[name] = [
    "webpack-dev-server/client?" + uri,
    "webpack/hot/dev-server"
  ].concat(webpackConfig.entry[name])
})


const compiler = webpack(webpackConfig)

const server = new webpackDevServer(compiler,{
  publicPath:webpackConfig.output.publicPath,
  hot: true ,
  quiet:true,
})

server.listen(port,function(err) {
  if (err) {
    console.error(err)
    return 
  }
  console.log('listen at' + uri)
  opn(uri)
})

