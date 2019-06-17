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
            response.writeHead(statusCode, {'Content-Type': 'text/html'});
            response.end(JSON.stringify(data));
        });
    }
});

server.listen(801);
console.log('server is running at http://127.0.0.1:801');
