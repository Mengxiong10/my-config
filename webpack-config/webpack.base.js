
const path = require('path')

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
    extensions:['.js','.json','.css','.scss'],
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
        use:['style-loader','css-loader','postcss-loader']
      },
      {
        test:/\.scss$/,
        use:['style-loader','css-loader','postcss-loader','sass-loader']
      }
    ]
  }
}