/**
 * api接口统一管理
 */
const baseUrl = 'teleport/api/v3';

export const api = {
    login: `${baseUrl}/login`, //登录
    verifyUser: `${baseUrl}/verify-user`, //验证用户名密码
    serverTime: `${baseUrl}/serverTime`, //服务器时间
    bindOath: `${baseUrl}/user/bind-oath`, //绑定身份验证器
    bindOathQRCode: `${baseUrl}/user/bind-oath-qrcode`, //绑定身份验证器二维码
    getHostsList: `${baseUrl}/asset/get-hosts`, //获取主机列表
    getAccountList: `${baseUrl}/asset/get-accounts`, //获取账号列表
    getHostGroupList: `${baseUrl}/asset/get-host-group`, //获取主机分组列表
    getAccountGroupList: `${baseUrl}/asset/get-account-group`, //获取账号分组列表
    getAccountGroupDetails: `${baseUrl}/asset/get-account-group-details`, //获取账号分组详情
    getUserList: `${baseUrl}/user/get-users`, //获取用户列表
    getRoleList: `${baseUrl}/user/get-role-list`, //获取角色列表
    updateUserInfo: `${baseUrl}/user/update-user`, //创建新用户/更新用户信息
    getLdapUser: `${baseUrl}/system/do-ldap-get-users`, //获取ldap用户列表
    updateUserRole: `${baseUrl}/user/set-role`, //更新用户角色
    getUserGroupList: `${baseUrl}/user/get-groups-with-member`, //获取用户分组列表
};
