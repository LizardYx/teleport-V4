module.exports = {
    devServer: {
        host: 'localhost', //主机名字
        port: 8080, //端口号
        open: true, //使用npm run serve后，是否自动打开浏览器页面
        proxy: { //配置跨域，请求后端接口
            '/api': {
                target: '', //接口地址，例如http://10.0.0.100:8080
                ws: false, //是否启用websocket
                changeOrigin: false, //是否开启代理
                pathRewrite: {
                    '^api': '/', //如组件需调用接口http://10.0.0.100:8080/user/info, 可直接写成/api/user/info
                }
            }
        }
    }
}
