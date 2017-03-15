const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
// import chalk from 'chalk';
const webpackConfig = require('./webpack.config');

const config = merge(webpackConfig, {
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});

webpack(config, (err, stats) => {
  if (err) throw err;

  process.stdout.write(`${stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  })}\n`);
});
