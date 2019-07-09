/**
 * api接口统一管理
 */
const baseUrl = 'teleport/api/v3';

export const api = {
    login: `${baseUrl}/login`, //登录
    verifyUser: `${baseUrl}/verify-user`, //验证用户名密码
    serverTime: `${baseUrl}/serverTime`, //服务器事时间
    bindOath: `${baseUrl}/bind-oath`, //绑定身份验证器信息
    bindOathQRCode: `${baseUrl}/bind-oath-qrcode`, //绑定身份验证器二维码
    bindOathToUser: `${baseUrl}/user/do-bind-oath`, //绑定身份验证器
};
