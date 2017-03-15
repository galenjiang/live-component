const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const webpackConfig = require('./webpack.config');

const config = merge(webpackConfig, {

  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    new webpack.NamedModulesPlugin(),
  ],

});


new WebpackDevServer(webpack(config), {
  stats: {
    colors: true,
  },
  contentBase: './server/',
  hot: true,
  historyApiFallback: true,
  // publicPath: '/',
  // inline: true,
  // host: '0.0.0.0',
}).listen(8080, '0.0.0.0', (err) => {
  if (err) throw err;
  console.log(chalk.yellow('[webpack-dev-server]', 'http://0.0.0.0:8080/'));
});
