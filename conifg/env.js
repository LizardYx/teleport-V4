//根据不同的环境更改不同的baseUrl
let baseUrl = '';

if (process.env.NODE_ENV == 'development') {
    baseUrl = '/api'; //开发环境地址

} else if (process.env.NODE_ENV == 'production') {
    baseUrl = ''; //生产环境地址
}

export {
    baseUrl,
}
