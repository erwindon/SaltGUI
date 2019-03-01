const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: './saltgui/static/scripts/index.js',
  mode: 'production',
  output: {
    filename: 'saltgui.bundle.js',
    path: path.resolve(__dirname, 'saltgui', 'static')
  },
  module: {
      rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
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