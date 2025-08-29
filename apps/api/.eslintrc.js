const { eslintPreset } = require('@humanet/config');

module.exports = {
  ...eslintPreset,
  env: {
    ...eslintPreset.env,
    node: true,
  },
};
