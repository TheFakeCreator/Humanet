const { eslintPreset } = require('./packages/config');

module.exports = {
  ...eslintPreset,
  root: true,
  ignorePatterns: ['node_modules/', 'dist/', 'build/', '.turbo/'],
};
