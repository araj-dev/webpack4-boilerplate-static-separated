const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
    entry: {
        index: './src/js/index.js',
        page1: './src/js/page1.js'
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            inject: 'body',
            chunks: ['index'],
        }),
        new HtmlWebPackPlugin({
            template: "./src/page1.html",
            filename: "./page1.html",
            inject: 'body',
            chunks: ['page1'],
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].css"
        })
    ],
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: './dist',
        watchContentBase: true,
        port: 3000,
        open: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }, {
                    loader: 'css-loader',
                    options: {
                        url: false
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            require('autoprefixer')(
                                {
                                    browsers: ['last 2 versions', 'Android >= 4'],
                                },
                            ),
                        ],
                    },
                }, {
                    loader: 'sass-loader',
                }],
            },            {
                test: /\.(gif|png|jpg)$/,
                use: [{
                    loader: 'url-loader'
                }]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            }
        ]
    }
};
