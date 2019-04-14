<template>
    <div id="login">
        <common-header></common-header>
        <div class="login-block">
            <el-row>
                <el-col :offset="16" :span="5">
                    <div class="login-content">
                        <div class="login-title">登陆</div>
                        <el-tabs v-model="loginWay" class="login-detail" stretch>
                            <el-tab-pane label="密码登陆" name="password">
                                <el-form :model="loginInfo" status-icon ref="loginInfo">
                                    <el-form-item prop="userName">
                                        <el-input type="text" v-model="loginInfo.userName" placeholder="请输入用户名">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item prop="password">
                                        <el-input type="password" v-model="loginInfo.password" show-password placeholder="请输入密码">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item prop="verificationCode">
                                        <el-input type="text" v-model="loginInfo.verificationCode" placeholder="请输入验证码">
                                            <template slot="append">.com</template>
                                        </el-input>
                                    </el-form-item>
                                    <el-checkbox class="remember-me" v-model="loginInfo.rememberMe">记住我，12小时内免登陆</el-checkbox>
                                    <el-form-item>
                                        <el-button type="primary" class="login-btn">登陆</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="身份验证器登陆" name="authentication">
                                <el-form :model="loginInfo" status-icon ref="loginInfo">
                                    <el-form-item prop="userName">
                                        <el-input type="text" v-model="loginInfo.userName" placeholder="请输入用户名">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item prop="password">
                                        <el-input type="password" v-model="loginInfo.password" show-password placeholder="请输入密码">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item prop="verificationCode">
                                        <el-input type="text" v-model="loginInfo.verificationCode" show-password
                                            placeholder="请输入六位数字身份器动态验证码">
                                        </el-input>
                                    </el-form-item>
                                    <el-checkbox class="remember-me" v-model="loginInfo.rememberMe">记住我，12小时内免登陆</el-checkbox>
                                    <el-form-item>
                                        <el-button type="primary" class="login-btn">登陆</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <router-link class="forgot-password" :to="{name: 'Login'}">忘记密码</router-link>
                            <router-link class="authenticator" :to="{name: 'Login'}">绑定身份验证器</router-link>
                        </el-tabs>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import CommonHeader from '../components/common-header.vue';

    export default {
        name: 'Login',
        components: { CommonHeader },
        data() {
            return {
                loginWay: 'password',
                loginInfo: {
                    userName: '',
                    password: '',
                    verificationCode: '',
                    rememberMe: false,
                },
            };
        },
    };
</script>

<style scoped>
    #login{
        position: relative;
        height: 100vh;
        background: #020815 url("../assets/login-bg.jpg");
    }

    #login .login-block{
        position: absolute;
        width: 100%;
        height: 400px;
        margin: auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    #login .login-block .login-title{
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        color: #303133;
        margin-bottom: 20px;
    }

    #login .login-content{
        width: 340px;
        padding: 15px;
        background: #fff;
    }
    #login .login-detail{
        padding: 0 20px;
    }

    #login .login-detail .remember-me{
        margin-bottom: 10px;
    }

    #login .login-detail .login-btn{
        width: 100%;
    }

    #login .forgot-password,
    #login .authenticator{
        color: #409EFF;
        margin-right: 15px;
    }
</style>
