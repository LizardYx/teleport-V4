<template>
    <div id="bindAuthenticator">
        <div id="bgCanvas"></div>
        <NoPermissionHeader></NoPermissionHeader>
        <div id="oath-content">
            <div class="title pad-ver" v-text="$t('i18n.绑定身份验证器页面.绑定身份验证器')"></div>
            <div class="pad-ver">
                <div class="title mar-btm" v-text="$t('i18n.绑定身份验证器页面.第一步：安装身份验证器')"></div>
                <div class="content">
                    {{$t('i18n.绑定身份验证器页面.请在你的手机上安装身份验证器App。')}}
                    <a @click="bindWayDialog.visible = true" v-text="$t('i18n.绑定身份验证器页面.点击此处获取安装方式')"></a>
                </div>
            </div>
            <div class="pad-ver">
                <div class="title mar-btm" v-text="$t('i18n.绑定身份验证器页面.第二步：检查服务器时间')"></div>
                <div class="content">
                    <div class="clearfix">
                        {{$t('i18n.绑定身份验证器页面.请注意检查您的手机时间与teleport服务器时间是否同步，')}}
                        <span class="color-warning" v-text="$t('i18n.绑定身份验证器页面.如果两者时间偏差超过两分钟则无法绑定')"></span>
                        {{$t('i18n.绑定身份验证器页面.，请及时通知系统管理员处理！')}}
                    </div>
                    <div class="server-date mar-top">
                        <label class="bg-color-main">{{$t('i18n.绑定身份验证器页面.TELEPORT服务器时间：')}}{{serverDate | dateFormat}}</label>
                    </div>
                </div>
            </div>
            <div class="pad-ver">
                <div class="title mar-btm" v-text="$t('i18n.绑定身份验证器页面.第三步：认证并绑定')"></div>
                <div class="content">
                    <el-form :model="authentication" status-icon :rules="validate" id="auth-form">
                        <el-form-item prop="userName">
                            <el-input type="text" v-model="authentication.userName" :placeholder="$t('i18n.绑定身份验证器页面.请输入用户名')"
                                      @keyup.enter.native="initBindOathDialog">
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" v-model="authentication.password" :placeholder="$t('i18n.绑定身份验证器页面.请输入密码')"
                                      @keyup.enter.native="initBindOathDialog">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="initBindOathDialog()" v-text="$t('i18n.绑定身份验证器页面.认证并绑定')"></el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="footer">
            <copyRight></copyRight>
        </div>
        <el-dialog id="bindWayDialog" :title="$t('i18n.绑定身份验证器页面.身份验证器')" :visible.sync="bindWayDialog.visible" :close-on-click-modal="false">
            <div class="oath-info">
                <el-row>
                    <el-col :span="12" class="oath-way">
                        <div class="mini-program mar-btm">
                            <div class="title" v-text="$t('i18n.绑定身份验证器页面.微信小程序')"></div>
                            <div class="content pad-lft">
                                <div>
                                    <span class="color-main" @click="updateSelectedOathWay(1)" v-text="$t('i18n.绑定身份验证器页面.二次验证码')"></span>
                                    <label class="label-tag" v-text="$t('i18n.绑定身份验证器页面.推荐')"></label>
                                </div>
                            </div>
                        </div>
                        <div class="google-oath mar-btm">
                            <div class="title" v-text="$t('i18n.绑定身份验证器页面.谷歌身份验证器')"></div>
                            <div class="content pad-lft">
                                <div>
                                    <span class="color-main" @click="updateSelectedOathWay(2)" v-text="$t('i18n.绑定身份验证器页面.IOS（Apple Store）')">
                                    </span>
                                </div>
                                <div>
                                    <span class="color-main" @click="updateSelectedOathWay(3)" v-text="$t('i18n.绑定身份验证器页面.Android（百度手机助手）')">
                                    </span>
                                </div>
                                <div>
                                    <span class="color-main" @click="updateSelectedOathWay(4)" v-text="$t('i18n.绑定身份验证器页面.Android（Google Play）')">
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="security-token mar-btm">
                            <div class="title" v-text="$t('i18n.绑定身份验证器页面.小米安全令牌')"></div>
                            <div class="content pad-lft">
                                <div>
                                    <span class="color-main" @click="updateSelectedOathWay(5)" v-text="$t('i18n.绑定身份验证器页面.IOS（Apple Store）')">
                                    </span>
                                </div>
                                <div>
                                    <span class="color-main" @click="updateSelectedOathWay(6)" v-text="$t('i18n.绑定身份验证器页面.Android（小米应用商店）')">
                                    </span>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12" class="text-center">
                        <div v-if="!!bindWayDialog.selectedId" class="title color-main">
                            {{getOathDetailValue('title')}}
                        </div>
                        <div>
                            <img :src="bindWayDialog.selectedImgUrl" alt="Teleport">
                        </div>
                        <div v-if="!!bindWayDialog.selectedId">
                            {{getOathDetailValue('description')}}
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click="bindWayDialog.visible = false">
                    <icon-svg icon-class="cancel"></icon-svg>
                    确定
                </el-button>
                <el-button size="mini" @click="bindWayDialog.visible = false">
                    <icon-svg icon-class="submit"></icon-svg>
                    取消
                </el-button>
            </div>
        </el-dialog>
        <el-dialog id="bindOathDialog" :title="$t('i18n.绑定身份验证器页面.绑定身份验证器')" :visible.sync="bindOathDialog.visible"
                   :close-on-click-modal="false">
            <div>
                <div v-text="$t('i18n.绑定身份验证器页面.请在手机上打开身份验证器，点击增加账号按钮，然后选择“扫描条形码”并扫描下面的二维码来完成账号绑定。')"></div>
                <div class="text-center pad-ver">
                    <img :src="bindOathDialog.imgUrl" alt="Teleport">
                </div>
                <div class="pad-btm bord-btm">
                    <label class="color-warning" v-text="$t('i18n.绑定身份验证器页面.温馨提示：')"></label>
                    {{$t('i18n.绑定身份验证器页面.如果无法扫描二维码，则可以选择“手动输入验证码”。')}}
                    {{$t('i18n.绑定身份验证器页面.设置一个容易记忆的账号名称，并确保“基于时间”一项是选中的，然后在“密钥”一项中输入下列密钥：')}}
                    <span class="color-success secret-key">{{bindOathDialog.secretKey}}</span>
                </div>
                <div class="pad-top">
                    <div class="pad-btm" v-text="$t('i18n.绑定身份验证器页面.然后请在下面的动态验证码输入框中输入身份验证器提供的6位数字：')"></div>
                    <el-row>
                        <el-col :span="8">
                            <el-input v-model="bindOathDialog.verificationCode" :placeholder="$t('i18n.绑定身份验证器页面.请输入动态验证码')" maxlength="6">
                            </el-input>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click="confirmBindOath()">
                    <icon-svg icon-class="cancel"></icon-svg>
                    验证并完成绑定
                </el-button>
                <el-button size="mini" @click="bindOathDialog.visible = false">
                    <icon-svg icon-class="submit"></icon-svg>
                    取消
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import NoPermissionHeader from '../components/no-permission-header';
    import copyRight from '@src/components/copy-right';
    import {setup} from '@public/lib/bg-canvas/swirl';
    import {formatTimeToStr} from '@src/assets/filter/date-format';
    import {asyncGet, asyncPost} from '@src/assets/axios'
    import {api} from "@src/assets/api";

    export default {
        name: 'bindAuthenticator',
        components: {NoPermissionHeader, copyRight},
        data() {
            let validateUserName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error(this.$t('i18n.绑定身份验证器页面.用户名不能为空')));
                }
            };
            let validatePassword = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error(this.$t('i18n.绑定身份验证器页面.密码不能为空')));
                }
            };
            return {
                timer: '',
                serverDate: 0,
                validate: {
                    userName: [{
                        validator: validateUserName, trigger: 'blur'
                    }],
                    password: [{
                        validator: validatePassword, trigger: 'blur'
                    }]
                },
                bindWayDialog: {
                    visible: false,
                    selectedId: 0,
                    selectedImgUrl: require('../assets/img/bind-oath/select-app.png'),
                    detailInfoList: [{
                        id: 1,
                        title: this.$t('i18n.绑定身份验证器页面.微信·小程序'),
                        icon: '',
                        imgName: 'wechat.png',
                        description: this.$t('i18n.绑定身份验证器页面.适用于IOS/Android，在微信小程序中搜索“二次验证码”即可')
                    },{
                        id: 2,
                        title: this.$t('i18n.绑定身份验证器页面.谷歌身份验证器'),
                        icon: '',
                        imgName: 'google-appStore.png',
                        description: this.$t('i18n.绑定身份验证器页面.适用于IOS，从Apple Store安装')
                    },{
                        id: 3,
                        title: this.$t('i18n.绑定身份验证器页面.谷歌身份验证器'),
                        icon: '',
                        imgName: 'google-baidu.png',
                        description: this.$t('i18n.绑定身份验证器页面.谷歌身份验证器')
                    },{
                        id: 4,
                        title: this.$t('i18n.绑定身份验证器页面.谷歌身份验证器'),
                        icon: '',
                        imgName: 'google-googlePlay.png',
                        description: this.$t('i18n.绑定身份验证器页面.适用于Android，从Google Play安装')
                    },{
                        id: 5,
                        title: this.$t('i18n.绑定身份验证器页面.小米安全令牌'),
                        icon: '',
                        imgName: 'xiaomi-appStore.png',
                        description: this.$t('i18n.绑定身份验证器页面.适用于IOS，从Apple Store安装')
                    },{
                        id: 6,
                        title: this.$t('i18n.绑定身份验证器页面.小米安全令牌'),
                        icon: '',
                        imgName: 'xiaomi-xiaomiStore.png',
                        description: this.$t('i18n.绑定身份验证器页面.适用于Android，从小米应用商店安装')
                    }]
                },
                bindOathDialog: {
                    visible: false,
                    imgUrl: '',
                    secretKey: '',
                    verificationCode: ''
                },
                authentication: {
                    userName: '',
                    password: ''
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
            },
            updateSelectedOathWay(id) {
                if (id) {
                    this.bindWayDialog.selectedId = id;
                    this.bindWayDialog.selectedImgUrl = require(`../assets/img/bind-oath/${this.getOathDetailValue('imgName')}`);
                }
            },
            getOathDetailValue(keyName) {
                let keyValue = '';

                if (keyName && !!this.bindWayDialog.selectedId) {
                    for (let oathDetailInfoObj of this.bindWayDialog.detailInfoList) {
                        if (oathDetailInfoObj.id === this.bindWayDialog.selectedId) {
                            keyValue = oathDetailInfoObj[keyName];
                            break;
                        }
                    }
                }
                return keyValue;
            },
            initBindOathDialog() {
                asyncPost(api.verifyUser, this.authentication)
                    .then(() => {
                        this.configBindOathDialog();
                    }, (error) => {
                        this.common.notification('warning', error.msg);
                    })
            },
            configBindOathDialog() {
                let that = this;

                Promise.all([asyncGet(api.bindOathQRCode, {}), asyncGet(api.bindOath, {})])
                    .then(function (response) {
                        that.bindOathDialog = {
                            visible: true,
                            // imgUrl: response[0].rows.QRCode,
                            imgUrl: require(`../assets/img/bind-oath/google-appStore.png`),
                            secretKey: response[1].rows.secret_key,
                            verificationCode: ''
                        };
                    }, function (error) {
                        this.common.notification('warning', error.msg);
                    })
            },
            validateBindOath() {
                let passValidate = this.bindOathDialog.verificationCode.length === 6;

                if (!passValidate) {
                    this.common.notification('warning', this.$t('i18n.绑定身份验证器页面.请输入六位动态验证码'));
                }
                return passValidate;
            },
            confirmBindOath() {
                if (this.validateBindOath()) {
                    this.$confirm(this.$t('i18n.绑定身份验证器页面.确认绑定该身份验证器？'), {
                        closeOnClickModal: false,
                    }).then(() => {
                        this.bindOathToUser();
                        this.bindOathDialog.visible = false;
                    })
                    .catch(() => {});
                }
            },
            bindOathToUser() {
                let params = {
                    userName: this.authentication.userName,
                    password: this.authentication.password,
                    oath_code: this.bindOathDialog.verificationCode
                };

                asyncPost(api.bindOath, params)
                    .then(() => {
                        this.common.notification('success', this.$t('i18n.绑定身份验证器页面.绑定身份验证器成功'));
                        this.$router.push({name: 'login'});
                    }, (error) => {
                        this.common.notification('warning', error.msg);
                    })
            }
        },
        mounted() {
            //初始化背景canvas
            setTimeout(function () {
                setup();
            }, 80);
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
            width: 100%;
            height: 60px;
        }
        #oath-content{
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
                    font-size: 20px;
                }
                > .content{
                    padding: 0 6px;
                    font-size: 14px;
                    .server-date{
                        height: 28px;
                        > label{
                            position: relative;
                            top: 4px;
                            padding: 6px 12px;
                            border-radius: $radius-middle;
                        }
                    }
                    > #auth-form{
                        width: 400px;
                    }
                }
            }
            > .title{
                font-size: 24px;
                padding-top: 0;
            }
        }
        .footer{
            position: fixed;
            bottom: 0;
            width: 100%;
        }
        #bindWayDialog{
            .oath-info{
                > div{
                    .title{
                        margin-bottom: 10px;
                    }
                    .content{
                        > div{
                            margin-bottom: 5px;
                            span.color-main{
                                cursor: pointer;
                            }
                            .label-tag{
                                margin-left: 5px;
                            }
                        }
                    }
                }
            }
        }
        #bindOathDialog{
            .secret-key{
                font-size: 18px;
            }
        }
    }
</style>
