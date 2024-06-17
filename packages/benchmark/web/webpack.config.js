const path = require('path');

module.exports = {
  entry: './pages/index.tsx', // adjust the entry point as per your project

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'], // add other extensions you might use
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
