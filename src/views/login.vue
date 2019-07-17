<template>
    <div id="login">
        <div id="bgCanvas"></div>
        <common-header></common-header>
        <div class="login-block">
            <div class="login-content pad-all">
                <div class="login-title mar-btm text-center">登陆</div>
                <el-tabs v-model="loginWay" class="login-detail pad-hor" @tab-click="updateLoginWay" stretch>
                    <el-tab-pane label="密码登陆" name="password">
                        <el-form :model="loginInfo" status-icon :rules="rules" ref="loginInfo">
                            <el-form-item prop="userName">
                                <el-input type="text" v-model="loginInfo.userName" @keyup.enter.native="login"
                                          placeholder="请输入用户名">
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input type="password" v-model="loginInfo.password" @keyup.enter.native="login"
                                          show-password placeholder="请输入密码">
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="verificationCode">
                                <el-input type="text" v-model="loginInfo.verificationCode" @keyup.enter.native="login"
                                          placeholder="请输入验证码">
                                    <template slot="append">.com</template>
                                </el-input>
                            </el-form-item>
                            <el-checkbox class="remember-me mar-btm" v-model="loginInfo.rememberMe">
                                记住我，12小时内免登陆
                            </el-checkbox>
                            <el-form-item>
                                <el-button type="primary" class="login-btn" @click="login">登陆</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="身份验证器登陆" name="authentication">
                        <el-form :model="loginInfo" status-icon ref="loginInfo">
                            <el-form-item prop="userName">
                                <el-input type="text" v-model="loginInfo.userName" @keyup.enter.native="login"
                                          placeholder="请输入用户名">
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input type="password" v-model="loginInfo.password" @keyup.enter.native="login"
                                          show-password placeholder="请输入密码">
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="verificationCode">
                                <el-input type="text" v-model="loginInfo.verificationCode" maxlength="6"
                                          @keyup.enter.native="login" placeholder="请输入6位数字身份验证器动态验证码">
                                </el-input>
                            </el-form-item>
                            <el-checkbox class="remember-me mar-btm" v-model="loginInfo.rememberMe">
                                记住我，12小时内免登陆
                            </el-checkbox>
                            <el-form-item>
                                <el-button type="primary" class="login-btn" @click="login">登陆</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <router-link class="forgot-password mar-rgt color-main" :to="{name: 'login'}">
                        忘记密码
                    </router-link>
                    <router-link v-if="loginWay === 'authentication'" class="authenticator color-main" :to="{name: 'bind-oath'}">
                        绑定身份验证器
                    </router-link>
                </el-tabs>
            </div>
        </div>
        <div class="footer">
            <copyRight></copyRight>
        </div>
    </div>
</template>

<script>
    import CommonHeader from '../components/common-header';
    import copyRight from '../components/copy-right';
    import {setup} from '../../public/lib/bg-canvas/swirl';
    import {asyncPost} from '../assets/axios'
    import {api} from "../assets/api";
    import store from "../store/store";

    export default {
        name: 'login',
        components: {CommonHeader, copyRight},
        data() {
            let validateUserName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入用户名'))
                }else {
                    callback();
                }
            };
            let validatePassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                }else {
                    callback();
                }
            };
            return {
                loginWay: 'password',
                loginInfo: {
                    userName: '',
                    password: '',
                    verificationCode: '',
                    rememberMe: false,
                },
                rules: {
                    userName: [
                        {validator: validateUserName, trigger: 'blur'}
                    ],
                    password:[
                        {validator: validatePassword, trigger: 'blur'}
                    ],
                },
            };
        },
        // computed: {
        //     token: function () {
        //         return store.state.common.token;
        //     }
        // },
        methods: {
            updateLoginWay() {
                this.loginInfo = {
                    userName: '',
                    password: '',
                    verificationCode: '',
                };
            },
            login() {
                asyncPost(api.login, this.loginInfo)
                    .then(() => {
                        store.commit('common/updateLogin', true);
                        this.$router.push({name: 'modules-main'});
                    }, (error) => {
                        this.$notify({
                            type: 'warning',
                            message: error.msg,
                            duration: 5000
                        });
                    })
            }
        },
        mounted() {
            setup();
        }
    };
</script>

<style lang="scss" scoped>
    #login{
        position: relative;
        height: 100vh;
        #header{
            position: fixed;
        }
        .login-block{
            position: absolute;
            width: 370px;
            height: 430px;
            margin: auto;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            > .login-content{
                width: 340px;
                background: #ffffffe8;
                > .login-title{
                    font-size: 24px;
                    font-weight: bold;
                }
                > .login-detail{
                    .login-btn{
                        width: 100%;
                    }
                }
            }
        }
        .footer{
            position: fixed;
            bottom: 0;
            width: 100%;
        }
    }
</style>
