import {baseUrl,} from "./env";
import axios from 'axios';
axios.defaults.timeout = 10000; //设置请求时间
axios.defaults.baseURL = baseUrl; //设置默认接口地址

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function asyncGet(url, params = {}){
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function asyncPost(url, data = {}){
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(response => {
                resolve(response.data);
            },err => {
                reject(err)
            })
    })
}
