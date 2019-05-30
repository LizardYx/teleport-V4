const webpack = require('webpack');
module.exports = {
    //部署应用包时的基本 URL
    publicPath: process.env.NODE_ENV === 'production' ? '' : './',
    //当运行 vue-cli-service build 时生成的生产环境构建文件的目录
    outputDir: 'dist',
    //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
    assetsDir: 'assets',
    // eslint-loader 是否在保存的时候检查 安装@vue/cli-plugin-eslint有效
    lintOnSave: true,
    //是否使用包含运行时编译器的 Vue 构建版本。设置true后你就可以在Vue组件中使用template选项了，但是这会让你的应用额外增加 10kb 左右
    runtimeCompiler: true,
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,

    //允许我们更细粒度的控制 webpack 的内部配置,例如：以下操作我们可以成功修改 webpack 中 module 项里配置 rules 规则为图片下的 url-loader 值，将其 limit 限制改为 5M
    chainWebpack: config => {
        config.module
            .rule("images")
            .use("url-loader")
            .loader("url-loader")
            .tap(options =>
                Object.assign(options,
                    {limit: 5120}
                )
            )
    },
    //可以在正式环境下关闭错误报告 console.log...
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
        } else {
            // 为开发环境修改配置...
        }
    },
    // css相关配置
    css: {
        // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中，生产环境下是true,开发环境下是false
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {},
        // 启用 CSS modules for all css / pre-processor files.
        modules: false
    },
    // webpack-dev-server 相关配置
    devServer: { // 设置代理
        hot: false, //热加载
        host: '0.0.0.0', //ip地址
        port: 8085, //端口
        https: false, //false关闭https，true为开启
        open: true, //自动打开浏览器
        proxy: {
            '/api': { //本地
                target: '', //例如：http://XXX.com/
                // 如果要代理 websockets
                ws: true,
                changeOrigin: true
            },
            '/test': { //测试
                target: ''
            },
            '/pre-release': {  //预发布
                target: ''
            },
            '/production': { //正式
                target: ''
            }
        }
    },
    pluginOptions: { // 第三方插件配置
        // ...
    }
};
