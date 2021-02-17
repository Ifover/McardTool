const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')



module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        // filename: '[name].bundle.js',
        filename: 'index.js',
        path: __dirname + '/dist',
        publicPath: "./"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000000,
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
        // new HtmlWebpackPlugin({
        //     template: __dirname + '/src/index.html',
        //     filename: 'index.html'
        // }),

    ],
    mode: 'development' //or 'production'
}
