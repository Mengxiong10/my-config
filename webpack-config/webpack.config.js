
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry:{
    app: './src/main.js'
  },
  output:{
    path: path.resolve(__dirname,'dist'),
    filename:'[name].js',
    publicPath:'/'
  },
  resolve:{
    //自动解析的扩展,在引入模块时可以不带扩展
    extensions:['.js','.json'],
    modules:[
      path.resolve(__dirname,'./src'),
      'node_modules'
    ],
    alias:{

    }
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        use:['babel-loader'],
        exclude:[path.resolve(__dirname,'node_modules')],
      },
      {
        test:/\.css$/,
        use:ExtractTextPlugin.extract({
          fallback:'style-loader',
          use:['css-loader?sourceMap','postcss-loader']
        })
      },
      {
        test:/\.scss$/,
        use:ExtractTextPlugin.extract({
          fallback:'style-loader',
          use:['css-loader?sourceMap','postcss-loader','sass-loader?sourceMap']
        })
      }
    ]
  },
  plugins:[
    new ExtractTextPlugin('static/css/[name].[contenthash].css')
  ]
}