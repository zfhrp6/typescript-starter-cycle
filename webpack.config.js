const argv = require('yargs').argv;
const webpack = require('webpack');
const path = require('path');
const debug = require('debug')('app:config:webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Environment Constants
const NODE_ENV = process.env.NODE_ENV;
const API_ENDPOINT = JSON.stringify(process.env.API_ENDPOINT);
const APP_URL = JSON.stringify(process.env.APP_URL);
const __DEV__ = NODE_ENV === 'development';
const __PROD__ = NODE_ENV === 'production';
const __TEST__ = NODE_ENV === 'test';
const __COVERAGE__ = !argv.watch && __TEST__;
const __BASENAME__ = JSON.stringify(process.env.BASENAME || '');
const GLOBALS = {
  'process.env': { NODE_ENV: JSON.stringify(NODE_ENV) },
  NODE_ENV: NODE_ENV,
  __DEV__: __DEV__,
  __PROD__: __PROD__,
  __TEST__: __TEST__,
  __COVERAGE__: __COVERAGE__,
  __BASENAME__: __BASENAME__
};

// Constants
const ROOT = path.resolve(__dirname);
const DIST = path.join(ROOT, 'dist');
const SRC = path.join(ROOT, 'src');
const PROJECT_PUBLIC_PATH = '/';

// Base Configuration
const webpackConfig = {
  name: 'client',
  target: 'web',
  devtool: 'source-map',
  resolve: {
    modules: [ SRC, 'node_modules' ],
    extensions: ['.ts', '.js', '.json']
  },
  module: { rules: [] }
};

// Entry
const APP_ENTRY = path.join(SRC, 'app.ts');
const WEBPACK_DEV_SERVER = `webpack-dev-server/client?path=${PROJECT_PUBLIC_PATH}`
webpackConfig.entry = {
  app: __DEV__
    ? [WEBPACK_DEV_SERVER, APP_ENTRY]
    : [APP_ENTRY],
  vendor: [
    '@cycle/run',
    '@cycle/http',
    '@cycle/history',
    '@cycle/isolate',
    '@cycle/dom',
    'xstream',
    'typestyle',
    'switch-path',
    'ramda'
  ]
};

// Output
webpackConfig.output = {
  filename: `[name].[hash].js`,
  chunkFilename: '[name].[chunkhash].js',
  path: DIST,
  publicPath: PROJECT_PUBLIC_PATH
};

// Optimization
webpackConfig.optimization = {
  chunkIds: 'total-size',
  minimize: true,
  minimizer: [new TerserPlugin()],
  moduleIds: 'size',
  splitChunks: {
    chunks: 'initial',
  },
};

// Plugins
webpackConfig.plugins = [
  new webpack.DefinePlugin(GLOBALS),
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: path.join(SRC, 'index.html'),
    hash: false,
    favicon: path.join(SRC, 'favicon.ico'),
    filename: 'index.html',
    inject: 'body',
    minify: { collapseWhitespace: true }
  }),
  new CopyWebpackPlugin({
    patterns: [
      { from: 'src/images', to: 'images' },
      { from: 'src/fonts', to: 'fonts' }
    ]
  })
];

if (__DEV__) {
  debug('Enabling plugins for live development (HMR, NoErrors).')
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
} else if (__PROD__) {
  webpackConfig.plugins.push(
    new webpack.optimize.AggressiveMergingPlugin()
  )
}

// Don't split bundles during testing, since we only want import one bundle
if (!__TEST__) {
  delete webpackConfig.optimization.splitChunks;
}

// Rules
function addRules(rules) {
  webpackConfig.module.rules = webpackConfig.module.rules.concat(rules);
}
// TypeScript and source maps
addRules([
  { test: /\.ts$/, loader: 'ts-loader' },
  { test: /\.js$/, loader: 'source-map-loader', enforce: 'pre', exclude: [path.join(ROOT, 'node_modules')] }
]);

module.exports = webpackConfig;
