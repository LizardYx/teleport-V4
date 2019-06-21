import {publicPath,} from "../../vue.config";
import axios from 'axios';
import QS from 'qs';
import store from "../store";
import router from "../router";
axios.defaults.timeout = 10000; //设置请求时间
axios.defaults.baseURL = publicPath; //设置默认接口地址
axios.defaults.headers['Content-Type'] = "application/x-www-form-urlencoded;charset=UTF-8";

/**
 * 请求拦截器
 * @returns {Promise}
 * 描述：用于某些请求需要用户登录之后才能访问。 或者post请求的时候，我们需要序列化提交的数据
 * token: 每次发送请求之前判断vuex中是否存在token。如果存在，则统一在请求的header中加上token。
 * 即使本地存在token，也有可能是过期token，所以要在拦截器中对返回状态进行判断
 */
axios.interceptors.request.use(
    config => {
        const token = store.state.token;
        token && (config.headers.Authorization = token);
        return config;
    },
    error => {
        return Promise.error(error);
    }
);

/**
 * 响应拦截器
 * @returns {Promise}
 */
axios.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        if (response.status === 200) {
            if (response.data.code !== 1) {
                return Promise.reject(response);
            }else {
                return Promise.resolve(response);
            }
        }else {
            return Promise.reject(response);
        }
    },
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 401：未登录
                // 跳转登录页面，并携带当前页面路径。重新登录成功后返回当前页面
                case 401:
                    router.replace({
                        path: "/",
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    });
                    break;
                // 403：token过期
                // 提示用户登录过期，清除本地token和vuex中的token。
                // 跳转登录页面，并携带当前页面路径。重新登录成功后返回当前页面
                case 403:
                    this.$notify({
                        type: 'warning',
                        message: '登录过期，请重新登录',
                        duration: 2000
                    });
                    localStorage.removeItem('token');
                    store.commit('loginSuccess', null);
                    setTimeout(() => {
                        router.replace({
                            path: "/",
                            query: {
                                redirect: router.currentRoute.fullPath
                            }
                        });
                    }, 2000);
                    break;
                // 404：请求不存在
                case 404:
                    this.$notify.error({
                        message: '网络请求不存在',
                        duration: 2000
                    });
                    break;
                // 其他错误，直接抛出错误提示
                default:
                    this.$notify({
                        type: 'warning',
                        message: error.response.data.msg,
                        duration: 2000
                    });
            }
        }
        return Promise.reject(error.response);
    }
);

/**
 * 封装get方法
 * @param url {String} [请求的url地址]
 * @param params {Object} [请求时携带的参数]
 * @returns {Promise}
 */
export function asyncGet(url, params){
    return new Promise((resolve, reject) => {
        axios.get(url, {params: params})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error.data)
            })
    })
}

/**
 * 封装post请求
 * @param url {String} [请求的url地址]
 * @param params {Object} [请求时携带的参数]
 * @returns {Promise}
 * 描述：post方法必须对提交的参数进行序列化(QS.stringify())，否则后台拿不到数据
 */
export function asyncPost(url, params){
    return new Promise((resolve, reject) => {
        axios.post(url, QS.stringify(params))
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error.data)
            })
    })
}
