
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')


module.exports = {
  devtool:'cheap-module-source-map',
  plugins:[
    //创建编译时可以使用的全局变量
    new webpack.DefinePlugin({
      'process.env':'"production"'
    }),
    new ExtractTextPlugin({
      filename: 'static/css/[name].[contenthash].css'
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true 
    }),
    //将来自node_modules 文件打包到vendor
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks:function(module) {
        return module.resource && 
          /\.js$/.test(module.resource) && 
          module.resource.indexOf('node_modules') !== -1
      }
    }),
    // 将每次构建时的webpack runtime 代码提取到单独manifest,
    // 可以当app 改变时,vendor 也不变化,文件长期缓存
    new webpack.optimie.CommonsChunkPlugin({
      name: 'manifest',
      chunks:['vendor']
    })
  ]
}