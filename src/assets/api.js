/**
 * api接口统一管理
 */
const baseUrl = 'teleport/api/v3';

export const api = {
    login: `${baseUrl}/login`, //登录
    serverTime: `${baseUrl}/serverTime` //服务器事时间
};
