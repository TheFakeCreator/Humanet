const { eslintPreset } = require('@humanet/config');

module.exports = {
  ...eslintPreset,
  extends: [...eslintPreset.extends, 'next/core-web-vitals'],
  env: {
    ...eslintPreset.env,
    browser: true,
    node: true,
  },
};
