const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    devServer: {
         contentBase: './dist'
    },
	plugins: [
		new CopyWebpackPlugin([{ from: './src/*', flatten: true}],   { ignore: [ '*.js'] })
	]
};