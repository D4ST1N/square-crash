const webpack = require('webpack');

module.exports = {
  configureWebpack: config => {
    return {
      plugins: [
        new webpack.DefinePlugin({
          'APPLICATION_VERSION': JSON.stringify(require('./package.json').version),
        })
      ]
    }
  },
}