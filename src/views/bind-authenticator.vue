<template>
    <div id="bindAuthenticator">
        <div id="bgCanvas"></div>
        <common-header></common-header>
        <div id="authenticator-content">
            <div class="title">绑定身份验证器</div>
            <div>
                <div class="title">第一步：安装身份验证器</div>
                <div class="content">
                    请在你的手机上安装身份验证器App。
                    <a href="">点击此处获取安装方式</a>
                </div>
            </div>
            <div>
                <div class="title">第二步：检查服务器时间</div>
                <div class="content">
                    <div class="clearfix">
                        请注意检查您的手机时间与teleport服务器时间是否同步，如果
                        <span class="el-alert--warning">两者时间偏差超过两分钟则无法绑定</span>
                        ，请及时通知系统管理员处理！
                    </div>
                    <div class="server-date">
                        <label>TELEPORT服务器时间：{{serverDate}}</label>
                    </div>
                </div>
            </div>
            <div>
                <div class="title">第三步：认证并绑定</div>
                <div class="content">
                    <el-form :model="authentication" status-icon :rules="validate" id="auth-form">
                        <el-form-item prop="userName">
                            <el-input type="text" v-model="authentication.userName" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" v-model="authentication.password" placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary">认证并绑定</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <copyRight></copyRight>
    </div>
</template>

<script>
    import CommonHeader from '../components/common-header.vue';
    import copyRight from '../components/copyRight';
    import {setup} from '../../public/login/swirl';

    export default {
        name: 'bindAuthenticator',
        components: { CommonHeader, copyRight },
        data() {
            let validateUserName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('用户名不能为空'));
                }
            };
            let validatePassword = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('密码不能为空'));
                }
            };
            return {
                serverDate: new Date(),
                authentication: {
                    userName: '',
                    password: ''
                },
                validate: {
                    userName: [{
                        validator: validateUserName, trigger: 'blur'
                    }],
                    password: [{
                        validator: validatePassword, trigger: 'blur'
                    }]
                }
            }
        },
        methods: {

        },
        mounted() {
            setup();
        }
    };
</script>

<style scoped>
    #bindAuthenticator{
        position: relative;
        height: 100vh;
    }

    #bindAuthenticator .clearfix:after{
        display: table;
        content: " ";
        clear: both;
    }

    #bindAuthenticator a{
        color: #409EFF;
    }

    #bindAuthenticator #authenticator-content{
        position: absolute;
        width: 900px;
        height: 484px;
        margin: auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 30px;
        background: #ffffffe8;
    }

    #bindAuthenticator #authenticator-content > .title{
        font-size: 24px;
        padding-top: 0;
    }

    #bindAuthenticator #authenticator-content > div{
        padding-top: 15px;
        padding-bottom: 15px;
        border-bottom: 1px dashed #C0C4CC;
    }

    #bindAuthenticator #authenticator-content > div:last-child{
        border: none;
        padding-bottom: 0;
    }

    #bindAuthenticator #authenticator-content > div > .title{
        font-size: 20px;
        margin-bottom: 15px;
    }

    #bindAuthenticator #authenticator-content > div > .content{
        padding: 0 6px;
        font-size: 14px;
    }

    #bindAuthenticator .server-date{
        margin-top: 15px;
        height: 28px;
    }

    #bindAuthenticator .server-date > label{
        position: relative;
        top: 4px;
        padding: 6px 12px;
        background-color: #409EFF;
        border-radius: 5px;
    }

    #bindAuthenticator #auth-form{
        width: 400px;
    }
</style>
