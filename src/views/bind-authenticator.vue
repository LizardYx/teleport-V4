<template>
    <div id="bindAuthenticator">
        <div id="bgCanvas"></div>
        <common-header></common-header>
        <div id="authenticator-content">
            <div class="title pad-ver">绑定身份验证器</div>
            <div class="pad-ver">
                <div class="title mar-btm">第一步：安装身份验证器</div>
                <div class="content">
                    请在你的手机上安装身份验证器App。
                    <a href="">点击此处获取安装方式</a>
                </div>
            </div>
            <div class="pad-ver">
                <div class="title mar-btm">第二步：检查服务器时间</div>
                <div class="content">
                    <div class="clearfix">
                        请注意检查您的手机时间与teleport服务器时间是否同步，如果
                        <span class="color-warning">两者时间偏差超过两分钟则无法绑定</span>
                        ，请及时通知系统管理员处理！
                    </div>
                    <div class="server-date mar-top">
                        <label class="bg-color-main">TELEPORT服务器时间：{{serverDate | dateFormat}}</label>
                    </div>
                </div>
            </div>
            <div class="pad-ver">
                <div class="title mar-btm">第三步：认证并绑定</div>
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
        <div class="footer">
            <copyRight></copyRight>
        </div>
    </div>
</template>

<script>
    import CommonHeader from '../components/common-header.vue';
    import copyRight from '../components/copy-right';
    import {setup} from '../../public/lib/bg-canvas/swirl';
    import {formatTimeToStr} from '../assets/filter/date-format';
    import {asyncGet} from '../assets/axios'
    import {api} from "../assets/api";

    export default {
        name: 'bindAuthenticator',
        components: {CommonHeader, copyRight},
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
                timer: '',
                serverDate: 0,
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
        filters: {
            dateFormat: function (time) {
                let date = new Date(time);

                return formatTimeToStr(date, 'yyyy-MM-dd hh:mm:ss');
            }
        },
        methods: {
            initServerDate() {
                asyncGet(api.serverTime, '')
                    .then(response => {
                        this.serverDate = response.rows.time;
                        this.timer = setInterval(this.updateServerDate, 1000);
                    })
            },
            updateServerDate() {
                this.serverDate += 1000;
            }
        },
        mounted() {
            setup(); //初始化背景canvas
            this.initServerDate(); //初始化服务器时间
        },
        beforeDestroy() {
            !!this.timer ? clearInterval(this.timer) : '';
        }
    };
</script>

<style lang="scss" scoped>
    #bindAuthenticator{
        position: relative;
        height: 100vh;
        #header{
            position: fixed;
        }
        #authenticator-content{
            position: absolute;
            width: 900px;
            height: 492px;
            margin: auto;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 30px;
            background: #ffffffe8;
            > div{
                border-bottom: 1px dashed #C0C4CC;
                &:last-child{
                    border: none;
                    padding-bottom: 0;
                }
                > .title{
                    font-size: $basic-size + 8px;
                }
                > .content{
                    padding: 0 6px;
                    font-size: $basic-size + 2px;
                    .server-date{
                        height: 28px;
                        > label{
                            position: relative;
                            top: 4px;
                            padding: 6px 12px;
                            border-radius: 5px;
                        }
                    }
                    > #auth-form{
                        width: 400px;
                    }
                }
            }
            > .title{
                font-size: 2 * $basic-size;
                padding-top: 0;
            }
        }
        .footer{
            position: fixed;
            bottom: 0;
            width: 100%;
        }
    }
</style>
