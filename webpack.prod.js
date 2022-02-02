const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

let compiler = webpack(
    merge(common, {
        mode: "production",
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: "/node_modules/",
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: [
                                    "@babel/preset-env",
                                    {
                                        targets: "last 2 versions",
                                        bugfixes: true,
                                        esmodules: true,
                                    },
                                ],
                                compact: false,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                openAnalyzer: false,
            }),
        ],
    })
);
compiler.run((err, stats) => {
    if (err) {
        console.error(err);
    } else {
        console.log("\nServing ready!\n");
    }
    compiler.close((closeErr) => {
        if (closeErr) {
            console.error(closeErr);
        }
    });
});
