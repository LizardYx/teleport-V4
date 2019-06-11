const path = require("path");
module.exports = {
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    // css相关配置
    css: {
        loaderOptions: {
            sass: {
                data: `
                    @import "@/assets/global.scss";
                `
            }
        }
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: [
                'C:\\Users\\Administrator\\Desktop\\teleport-V4\\src\\assets\\global.scss'
            ]
        }
    }
};
