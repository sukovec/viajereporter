const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
	mode: "development", 
	entry: './app/index.tsx',
	devtool: "inline-source-map",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader' ]
			}
		],
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js', '.css' ]
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		new CopyPlugin( [ { "from": "static", "to": "." } ])
	]
};


