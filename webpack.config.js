var path = require('path')
var webpack = require('webpack')
function resolve (dir) {
	return path.join(__dirname, '..', dir)
}


module.exports = {
	entry: {
		home: './src/home.js'
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist/',
		filename: '[name].build.js'
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						// Since sass-loader (weirdly) has SCSS as its default parse mode, we map
						// the "scss" and "sass" values for the lang attribute to the right configs here.
						// other preprocessors should work out of the box, no loader config like this nessessary.
						'scss': 'vue-style-loader!css-loader!sass-loader',
						'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
					}
					// other vue-loader options go here
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.styl$/,
				loader: 'css-loader!stylus-loader?paths=node_modules/bootstrap-stylus/stylus/'
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
					name: '[name].[ext]?[hash]'
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
					name: '[name].[ext]?[hash]'
				}
			}
		]
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'vue$': 'vue/dist/vue.common.js',
			'@common': resolve('/src/components/common'),
			'@models': resolve('/src/components/models'),
			'@echarts': resolve('/src/components/echarts'),
			'@': resolve('src')
		}
	},

	devServer: {
		host: "127.0.0.1",
		port: 8282,
		historyApiFallback: true,
		noInfo: true,
		inline: true //实时刷新
	},
	performance: {
		hints: false
	},
	devtool: '#cheap-module-eval-source-map'
	// devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
	module.exports.devtool = '#cheap-module-source-map';
	// module.exports.devtool = '#source-map'
	// http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			compress: {
				warnings: false
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		})
	])
}
