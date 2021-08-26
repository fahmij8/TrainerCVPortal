const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const path = require("path");

module.exports = merge(common, {
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        open: true,
        port: 8080,
        static: {
            directory: path.join(__dirname, "src"),
            watch: true,
        },
    },
});
