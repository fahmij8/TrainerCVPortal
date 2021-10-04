const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = {
    entry: "./src/scripts/app.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle-[chunkhash].js",
        clean: true,
        publicPath: "/",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/images/[hash][ext][query]",
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/fonts/[hash][ext][query]",
                },
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        fallback: {
            fs: false,
            buffer: require.resolve("buffer"),
        },
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            minSize: 20000,
            maxSize: 70000,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            automaticNameDelimiter: "~",
            enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: false,
                },
            },
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/templates/index.html",
            filename: "index.html",
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            jquery: "jquery",
            "window.jQuery": "jquery",
        }),
        new FaviconsWebpackPlugin({
            logo: path.resolve(__dirname, "src/assets/logo-transparent.png"),
            mode: "webapp",
            devMode: "webapp",
            prefix: "assets/icons/",
            inject: true,
            favicons: {
                appName: "Trainer Computer Vision Portal",
                appShortName: "TrainerCV",
                appDescription: "Portal Trainer Computer Vision - DPTE FPTK UPI",
                developerName: "Fahmi Jabbar",
                background: "#F8F9FA",
                theme_color: "#F8F9FA",
                appleStatusBarStyle: "black-translucent",
                start_url: "/",
                scope: "/",
                display: "standalone",
                orientation: "any",
                icons: {
                    android: true,
                    appleIcon: true,
                    appleStartup: false,
                    coast: false,
                    favicons: true,
                    firefox: false,
                    windows: true,
                    yandex: false,
                },
            },
        }),
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
        }),
        new webpack.ProvidePlugin({
            process: "process/browser",
        }),
    ],
};
