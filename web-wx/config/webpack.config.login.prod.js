const paths = require("./paths");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let {apiPath, publicPath,loginPageVersion} = paths;

module.exports = {
    // devtool: "source-map",
    devtool: false,
    mode: "production",
    entry: {
        login: paths.resolveApp("src/pages/login/index.js")
    },

    output: {
        path: paths.resolveApp("build"),
        publicPath: publicPath,
        filename: "js/bundle.[name]." + loginPageVersion + ".js",
    },

    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json'],
        alias: {
            "@global": paths.resolveApp("src/global.js"),
            "@utils": paths.resolveApp("src/utils"),
            "@asserts": paths.resolveApp("src/asserts"),
            "@components": paths.resolveApp("src/components"),
        }
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    //stage-1 支持成员变量
                    presets: ['es2015', 'react', "stage-1"],
                    plugins: [
                        //装饰器支持
                        "transform-decorators-legacy",
                        "transform-runtime",
                        ["import", {
                            "libraryName": "antd",
                            "libraryDirectory": "es",
                            "style": "css"
                        }]
                    ]
                }
            },
            {
                test: /\.(css)$/,
                use: [MiniCssExtractPlugin.loader, {loader: 'css-loader', options: {modules: true}}]
            },
            {
                test: /\.(less)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', {
                    loader: 'less-loader',
                    options: {javascriptEnabled: true}
                }]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: "file-loader",
                options: {
                    publicPath: publicPath,
                    name: "image/[hash].[ext]"
                },
            }
        ]
    },

    optimization: {
        namedModules: true,
        minimize: true,
        mergeDuplicateChunks: true,
    },

    plugins: [
        new CleanWebpackPlugin([paths.resolveApp("build")], {root: paths.resolveApp(".")}),
        new CopyWebpackPlugin([{from: 'public', to: "view", ignore: "*.html"}]),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/bundle.[name]."+loginPageVersion+".css",
            chunkFilename: "css/bundle.[id]."+loginPageVersion+".css",
        }),
        new webpack.DefinePlugin({//全局变量
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                PUBLIC_PATH: JSON.stringify(publicPath),
                API_PATH: JSON.stringify(apiPath),
            }
        }),
        new HtmlWebpackPlugin({
            PUBLIC_PATH: publicPath,
            title:"登录",
            inject:true,
            chunks: ["login"],
            filename: "view/login.html",
            template: paths.resolveApp("public/index.html")
        }),
    ]
};