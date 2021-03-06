const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ora = require('ora')
const del = require('del')

const webpackBase = require('./webpack.base.js')

const webpackConfig = merge(webpackBase, {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
          fallback: 'style-loader'
        })
      }
    ]
  },
  devtool: 'cheap-module-source-map',
  output: {
    filename: 'static/js/[name].[chunkhash].js',
    // 按需加载的chunk
    chunkFilename: 'static/js/[id].[chunkhash].js'
  },
  plugins: [
    // 创建编译时可以使用的全局变量
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new ExtractTextPlugin({
      filename: 'static/css/[name].[contenthash].css'
    }),

    new HTMLWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
      inject: true,
      chunksSortMode: 'dependency',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }),
    // 将来自node_modules 文件打包到vendor
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf('node_modules') !== -1
      }
    }),
    // 将每次构建时的webpack runtime 代码提取到单独manifest,
    // 可以当app 改变时,vendor不变化,文件长期缓存
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    })
  ]
})

console.log(webpackConfig)

del.sync(['dist'])

const spinner = ora('building dist...').start()

webpack(webpackConfig, (err, stats) => {
  spinner.stop()
  if (err) throw err
  const info = stats.toJson()
  if (stats.hasErrors()) {
    console.error(info.errors)
  }
  if (stats.hasWarnings()) {
    console.warn(info.warning)
  }
  console.log(stats.toString({
    colors: true,
    chunks: false,
    children: false
  }))
})
