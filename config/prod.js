const webpack = require('webpack');

const prod = (config, _path) => {
  //   config.mode = 'production';
  config.output.path = _path;

  return config;
};

module.exports = prod;
