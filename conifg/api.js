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
export const api_login = (params) => asyncPost('api/v3/login', params);
