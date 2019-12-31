const path = require("path");

function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    // 部署应用包时的基本 URL
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    // 当运行 vue-cli-service build 时构建文件的目录
    outputDir: 'dist',
    // 生成的静态资源文件名中是否包含 hash
    filenameHashing: true,
    // 生产环境的 source map
    productionSourceMap: true,
    // 如果你构建后的文件是部署在 CDN 上的，启用该选项可以提供额外的安全性
    integrity: false,
    // css相关配置
    css: {
        loaderOptions: {
            sass: {
                data: `
                    @import "@/assets/css/variables.scss";
                `
            }
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('@src', resolve('src'))
            .set('@public', resolve('public'))
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: [
                path.resolve(__dirname, "@/assets/css/variables.scss")
            ]
        }
    },
    devServer: {
        proxy: "http://127.0.0.1:801"
    }
};
