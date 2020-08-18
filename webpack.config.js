import HtmlWebpackPlugin from "html-webpack-plugin";
const webpack = require('webpack');
const path = require('path');
var config = {
	entry: './main.js',

	output: {
		path: path.join(__dirname, '/dist'),
		filename: 'index.js',
	},

	devServer: {
		inline: true,
		port: 8080
	},
	resolveLoader: {
		modules: [path.join(__dirname, 'node_modules')]
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',

				query: {
					presets: ['es2015', 'react']
				}
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			favicon: "./src/favicon.png"
		}),
	]
}

module.exports = config;