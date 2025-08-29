const { eslintPreset } = require('@humanet/config');

module.exports = {
  ...eslintPreset,
  env: {
    ...eslintPreset.env,
    browser: true,
    node: true,
  },
};
