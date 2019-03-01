const path = require('path');

module.exports = {
  entry: './saltgui/static/scripts/index.js',
  output: {
    filename: 'saltgui.js',
    path: path.resolve(__dirname, 'dist')
  }
};