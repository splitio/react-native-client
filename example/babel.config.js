const path = require('path');
const pkg = require('../package.json');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          [pkg.name]: path.join(__dirname, '..', pkg.source),
        },
      },
    ],
  ],
};
