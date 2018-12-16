const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const fs = require("fs");

function generateHtmlPlugins (templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(item => {
        const parts = item.split('.');
        const name = parts[0];
        const extension = parts[1];

        return new HtmlWebPackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
            inject: 'body',
            chunks: [`${name}`]
        })
    });
}

function generateEntries (entryDir) {
    const entryFiles = fs.readdirSync(path.resolve(__dirname, entryDir));

    let entries = {};

    entryFiles.map(item => {
        const parts = item.split('.');
        const name = parts[0];
        const extension = parts[1];

        entries[`${name}`] = `${entryDir}/${name}.${extension}`
    });

    return entries;
}

const htmlPlugins = generateHtmlPlugins('./src/templates');
const entries = generateEntries('./src/js');

module.exports = {
    mode: "development",
    entry: entries,
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].css"
        })
    ].concat(htmlPlugins),
    output: {
        filename: 'js/[name].js',
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
                test: /\.ejs$/,
                use: 'ejs-compiled-loader'
            }
        ]
    }
};
