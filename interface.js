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
        if (request.url.indexOf(`${commonUrl}/asset/get-accounts`) >= 0) {
            data.rows = {
                data: [{
                    id: 2,
                    state: 1,
                    protocol_type: 1,
                    protocol_port: 3389,
                    auth_type: 1,
                    username: "root",
                    username_prompt: "",
                    password_prompt: ""
                },{
                    id: 4,
                    state: 1,
                    protocol_type: 2,
                    protocol_port: 22,
                    auth_type: 2,
                    username: "root",
                    username_prompt: "",
                    password_prompt: ""
                },{
                    id: 3,
                    state: 1,
                    protocol_type: 3,
                    protocol_port: 23,
                    auth_type: 1,
                    username: "root",
                    username_prompt: "ogin:username",
                    password_prompt: "assword:notice"
                }],
                count: 3
            }
        }
        if (request.url.indexOf(`${commonUrl}/asset/get-host-group`) >= 0) {
            data.rows = {
                data: [{
                    id: 1,
                    state: 1,
                    name: '分组名称',
                    desc: '描述信息',
                    host_count: 1,
                    hostList: [{
                        id: 1,
                        os_type: 1,
                        name: '测试服务器',
                        ip: '10.0.0.1',
                        router_ip: "",
                        router_port: 0,
                        cid: '111',
                    },{
                        id: 2,
                        os_type: 2,
                        name: '服务器2',
                        ip: '10.0.0.5',
                        router_ip: "",
                        router_port: 0,
                        cid: '111',
                    },{
                        id: 3,
                        os_type: 2,
                        name: '测试服务器3',
                        ip: '10.0.0.14',
                        router_ip: "",
                        router_port: 0,
                        cid: '111',
                    }]
                }],
                count: 3
            }
        }
        if (request.url.indexOf(`${commonUrl}/asset/get-account-group`) >= 0) {
            data.rows = {
                data: [{
                    id: 1,
                    state: 1,
                    name: '分组名称',
                    desc: '描述信息',
                    member_count: 1,
                    memberList: [{
                        id: 1,
                        host_id: 1,
                        username: 'root',
                        protocol_type: 1,
                        hostInfo: {
                            id: 1,
                            name: '主机测试',
                            ip: '10.0.0.11',
                            router_ip: '',
                            router_port: '',
                            state: 1
                        }
                    }]
                }],
                count: 3
            }
        }
        if (request.url.indexOf(`${commonUrl}/asset/get-account-group-details`) >= 0) {
            data.rows = {
                data: [{
                    id: 1,
                    host_id: 1,
                    username: 'root',
                    protocol_type: 1,
                    auth_type: 1,
                    state: 1,
                    username_prompt: '',
                    password_prompt: '',
                    hostInfo: {
                        id: 1,
                        name: '主机测试',
                        ip: '10.0.0.11',
                        router_ip: '',
                        router_port: 0,
                        state: 1
                    }
                }],
                count: 3
            }
        }
        if (request.url.indexOf(`${commonUrl}/user/get-users`) >= 0) {
            data.rows = {
                data: [{
                    id: 1,
                    type: 1,
                    auth_type: 0x0002,
                    username: 'admin',
                    surname: 'admin',
                    role_id: 1,
                    state: 1,
                    email: '563011419@qq.com',
                    last_login: 1579635150,
                    role: '系统管理员',
                    privilege: 4294967295
                },{
                    id: 2,
                    type: 1,
                    auth_type: 0x0008,
                    username: 'test',
                    surname: '张三',
                    role_id: 1,
                    state: 1,
                    email: '563011419@qq.com',
                    last_login: 1579635150,
                    role: '系统管理员',
                    privilege: 4294967285
                }],
                count: 3
            }
        }
        if (request.url.indexOf(`${commonUrl}/user/get-role-list`) >= 0) {
            data.rows = {
                data: [{
                    id: 1,
                    name: '系统管理员',
                    privilege: 4294967295
                },{
                    id: 2,
                    name: '运维人员',
                    privilege: 513
                },{
                    id: 3,
                    name: '审计员',
                    privilege: 32769
                }]
            }
        }
        if (request.url.indexOf(`${commonUrl}/system/do-ldap-get-users`) >= 0) {
            data.rows = {
                data: [{
                    id: 1,
                }],
                count: 3
            }
        }
        if (request.url.indexOf(`${commonUrl}/user/get-groups-with-member`) >= 0) {
            data.rows = {
                data: [{
                    id: 1,
                    name: '技术部',
                    desc: '技术部人员分组',
                    member_count: 2,
                    members: [{
                        id: 1,
                        username: 'admin',
                        surname: 'admin',
                        email: '563011491@qq.com'
                    },{
                        id: 2,
                        username: '张三',
                        surname: 'test',
                        email: '563011491@qq.com'
                    }],
                    state: 1,
                    _mid: [1, 5]
                }],
                count: 3
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
