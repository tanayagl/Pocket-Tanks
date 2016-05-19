var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var path = require('path');
var root = path.join(__dirname, '..');
var open = require("open");

var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 9000;
// env = 'production';
var isProd = (env === 'production');
var entry = [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:' + port + '/',
    './main.ts'
];
var plugins = [new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin()];
if (isProd) {
    entry = ['./main.ts'];
    plugins = [];
}

var compiler = webpack({
    devtool: isProd ? 'cheap-module-source-map' : 'cheap-module-eval-source-map',
    entry: entry,
    output: {
        filename: "bundle.js",
        path: root + "/build"
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015']
                }
            },
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    },
    plugins: [
        ...plugins,
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env),
            //'console': isProd ? 'customPolyfill' : 'console'
        })
    ]
});

var server = new WebpackDevServer(compiler, {
    // webpack-dev-server options

    contentBase: root,
    // or: contentBase: "http://localhost/",

    hot: true,
    // Enable special support for Hot Module Replacement
    // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
    // Use "webpack/hot/dev-server" as additional module in your entry point
    // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.

    // Set this as true if you want to access dev server from arbitrary url.
    // This is handy if you are using a html5 router.
    historyApiFallback: false,

    //// Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
    //// Use "*" to proxy all paths to the specified server.
    //// This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
    //// and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
    //proxy: {
    //    "*": "http://localhost:9090"
    //},

    // webpack-dev-middleware options
    quiet: false,
    noInfo: false,
    headers: { "X-Custom-Header": "yes" },
    stats: { colors: true },
});

server.listen(port, "localhost", function () {
    console.log('Server Running', root);
    open("http://localhost:" + port);
});