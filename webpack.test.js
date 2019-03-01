const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackNodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
  entry: './tests/unit/index.js',
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: 'tests.bundle.js',
    path: path.resolve(__dirname, 'saltgui', 'static')
  },
  target: 'node',
  externals: [WebpackNodeExternals()],
  plugins: [
    new WebpackShellPlugin({
        onBuildExit: "mocha saltgui/static/tests.bundle.js"
    })
 ],
  module: {
      rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    sourceType: 'unambiguous'
                }
            }
        },
        {
            test: /\.(jpe?g|gif|png)$/,
            loader: 'file-loader',
            options: {
                emitFile: true,
                name: 'assets/[ext]/[name].[hash].[ext]',
                outputPath: function (url) {
                    return url;
                },
                publicPath: function (url) {
                    return url;
                }
            }
        },
        {
            test: /\.(html)$/,
            use: [{
                loader: 'html-loader',
                options: {
                    minimize: true,
                    collapseWhitespace: true
                }
            }]
        },
        {
            test: /\.(css|sass|scss)$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2,
                        sourceMap: true
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true
                    }
                }
            ]
        }
    ]
  }
};