/**
 * api接口统一管理
 */
const baseUrl = 'teleport/api/v3';

export const api = {
    login: `${baseUrl}/login`, //登录
    verifyUser: `${baseUrl}/verify-user`, //验证用户名密码
    serverTime: `${baseUrl}/serverTime`, //服务器事时间
    bindOath: `${baseUrl}/user/bind-oath`, //绑定身份验证器
    bindOathQRCode: `${baseUrl}/user/bind-oath-qrcode`, //绑定身份验证器二维码
    getHostsList: `${baseUrl}/asset/get-hosts`, //获取主机列表
    getHostAccountList: `${baseUrl}/asset/get-accounts`, //获取主机账号列表
    getHostGroupList: `${baseUrl}/asset/get-host-group`, //获取主机分组列表
    getAccountGroupList: `${baseUrl}/asset/get-account-group`, //获取账号分组列表
};
