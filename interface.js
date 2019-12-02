//模拟接口
'use strict';

const http = require('http');
const querystring = require('querystring');

let server = http.createServer(function (request, response) {
    let commonUrl = '/teleport/api/v3';
    let statusCode = 200;
    let data = {
        code: 1,
        rows: {},
        msg: ''
    };

    if (request.method === 'GET') {
        if (request.url === `${commonUrl}/serverTime`) {
            data.rows.time = (new Date()).getTime();
        }
        if (request.url === `${commonUrl}/user/bind-oath`) {
            data.rows.secret_key = 'T5NUVIZTGTCMMNLKAZ64DGLRDU';
        }
        if (request.url === `${commonUrl}/user/bind-oath-qrcode`) {
            data.rows.QRCode = '';
        }
        if (request.url.indexOf(`${commonUrl}/asset/get-hosts`) >= 0) {
            data.rows = {
                data: [{
                    _id: 1,
                    acc_count: 0,
                    cid: '111',
                    desc: 'this is for test',
                    id: 1,
                    ip: "10.0.0.1",
                    name: "测试服务器",
                    os_type: 1,
                    os_ver: "",
                    router_ip: "",
                    router_port: 0,
                    state: 1,
                    type: 1,
                },{
                    _id: 2,
                    acc_count: 0,
                    cid: '1112',
                    desc: '1.备注    123123\n2备注说明\n\n4.备注',
                    id: 1,
                    ip: "10.0.0.1",
                    name: "test",
                    os_type: 2,
                    os_ver: "",
                    router_ip: "",
                    router_port: 0,
                    state: 2,
                    type: 1,
                }],
                count: 2000
            }
        }
        response.writeHead(statusCode, {'Content-Type': 'text/html'});
        //参数序列化
        response.end(JSON.stringify(data));
    }else if (request.method === 'POST') {
        let params = '';

        //通过data事件监听函数，收集请求数据
        request.on('data', function (chunk) {
            params += chunk;
        });
        request.on('end', function () {
            //解析请求体
            params = querystring.parse(params);
            if (request.url === `${commonUrl}/login`) {
                if (params.userName !== 'admin' || params.password !== '1234asd') {
                    data = {
                        code: -1,
                        rows: {},
                        msg: '用户名或密码错误，请重新输入'
                    };
                }else if (params.verificationCode !== '123456') {
                    data = {
                        code: -1,
                        rows: {},
                        msg: '验证码错误，请重新输入'
                    };
                }
            }
            if (request.url === `${commonUrl}/verify-user`) {
                if (params.userName !== 'admin' || params.password !== '1234asd') {
                    data = {
                        code: -1,
                        rows: {},
                        msg: '用户名或密码错误，请重新输入'
                    };
                }
            }
            if (request.url === `${commonUrl}/user/bind-oath`) {
                if (params.userName !== 'admin' || params.password !== '1234asd') {
                    data = {
                        code: -1,
                        rows: {},
                        msg: '用户名或密码错误，请重新输入'
                    };
                }
                if (params['oath_code'] !== '123456') {
                    data = {
                        code: -1,
                        rows: {},
                        msg: '动态验证码错误，请重新输入'
                    };
                }
            }
            response.writeHead(statusCode, {'Content-Type': 'text/html'});
            response.end(JSON.stringify(data));
        });
    }
});

server.listen(801);
console.log('server is running at http://127.0.0.1:801');
