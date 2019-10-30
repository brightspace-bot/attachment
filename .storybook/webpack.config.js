const merge = require('webpack-merge');
const defaultConfig = require('@open-wc/demoing-storybook/default-storybook-webpack-config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = ({ config }) => {
  config = merge(config, {
    plugins: [new CopyWebpackPlugin(['./locales/**', './icons/**'])].filter(_ => !!_),
  });
  console.log('My config', config);
  wpConfig = defaultConfig({
    config,
    transpilePackages: ['lit-html', 'lit-element', '@open-wc', '@brightspace-ui', 'siren-sdk'],
  });
  console.log('Full config', wpConfig);
  return wpConfig;
};
