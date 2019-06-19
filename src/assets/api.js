/**
 * api接口统一管理
 */
import {asyncGet, asyncPost} from './axios'

/**
 * 登录
 * @param userName {string} [用户名]
 * @param password {int} [密码]
 * @param verificationCode {int} [验证码,6]
 * @param rememberMe {blur} [记住我]
 * @returns {Promise}
 */
const login = (params) => asyncPost('teleport/api/v3/login', params);

const serverTime = () => asyncGet('teleport/api/v3/serverTime', {});

const api = {
    login: login,
    serverTime: serverTime
};

export {
    api
}
