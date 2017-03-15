const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isServer = () => process.env.NODE_BD === 'server';

// 模块导入
module.exports = {
  context: path.resolve('__dirname', '../'),

  devtool: isServer() ? 'eval-source-map' : 'source-map',

  // 入口文件地址
  entry: {
    app: (isServer() ? [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://0.0.0.0:8080/',
      'webpack/hot/only-dev-server',
      './src/index.jsx',
    ] : [
      './src/index.jsx',
    ]),
    vendor: ['react', 'react-dom', 'lodash', 'moment'],
  },

  output: {
    path: path.resolve(isServer() ? 'server' : 'dist'),
    filename: isServer() ? '[name].js' : '[name].js',
    // chunkFilename: isServer() ? '[chunkhash].js' : '[chunkhash:8].chunk.js',

    // 公共文件生成的地址
    publicPath: isServer() ? '/' : '/',
  },

  resolve: {
    // require时省略的扩展名，如：require('module') 不需要module.js
    extensions: ['.js', '.jsx', '.json'],
  },

  externals: {
    // react: 'react',
    // lodash: 'lodash',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },

      {
        test: /^((?!\.M).)*less$/,
        use: isServer() ? ['style-loader', 'css-loader?sourceMap=true', 'postcss-loader?sourceMap=inline', 'less-loader'] :
          ExtractTextPlugin.extract({
            use: 'css-loader!postcss-loader!less-loader',
            fallback: 'style-loader',
          }),
      },

      {
        test: /\.M\.less$/,
        use: isServer()
          ? ['style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: true,
                localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
              },
            },
            'postcss-loader?sourceMap=true',
            'less-loader?sourceMap=true']
          : ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  sourceMap: true,
                  // importLoaders: 1,
                  localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: true,
                },
              },
            ],
          // publicPath: '/dist',
          }),
      },

      {
        test: /\.css$/,
        // exclude: /node_modules/,
        use: isServer() ? [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              // modules: true,
              // importLoaders: 1,
              // localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
          },
        ] : ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                // modules: false,
                // importLoaders: 1,
                // localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
            },
          ],
          // publicPath: '/dist',
        }),
      },


      // 图片转化，小于8K自动转化为base64的编码
      {
        test: /\.(png|jpg|gif)$/,
        use: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
      },

      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: 'url-loader?limit=10000&name=./font/[name].[ext]',
      },
    ],
  },

  plugins: [

    // 提供全局的变量，在模块中使用无需用require引入
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name].js',
      minChunks: Infinity,
    }),

    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    //   },
    // }),

    new ExtractTextPlugin({
      filename: 'app.css',
      // disable: false,
      // allChunks: true,
    }),

  ],

};
