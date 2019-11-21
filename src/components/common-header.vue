<template>
    <div id="header" class="pad-hor" v-bind:class="{'has-login basic-box-shadow': isLogin}">
        <router-link class="logo" :to="{path: isLogin ? '/modules-main/system-overview' : '/'}">
            <img src="../assets/img/logo.png" alt="Teleport">
        </router-link>
        <div class="header-right">
            <i v-if="isLogin" class="collapse-icon" v-bind:class="{'el-icon-s-unfold': isCollapse, 'el-icon-s-fold': !isCollapse}"
               @click="updateCollapse">
            </i>
            <div class="right">
                <el-dropdown class="user-info">
                    <label>
                        <span>{{$t('i18n.您好，')}}乌拉</span>
                    </label>
                    <el-dropdown-menu solt="dropdown">
                        <el-dropdown-item class="mar-btm">
                            <i class="el-icon-user-solid"></i>
                            {{$t('i18n.个人信息')}}
                        </el-dropdown-item>
                        <el-button id="logOut" class="float-right mar-rgt" size="mini" type="primary" @click="logOut">
                            {{$t('i18n.登出')}}
                        </el-button>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown class="lang pad-hor" trigger="click" @command="updateLang">
                    <label>
                        <icon-svg :icon-class="currentLang.iconName"></icon-svg>
                        <span>
                            {{currentLang.name}}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                    </label>
                    <el-dropdown-menu solt="dropdown">
                        <el-dropdown-item v-for="langObj in langList" :command="langObj.tag">
                            <icon-svg :icon-class="langObj.iconName"></icon-svg>
                            {{langObj.name}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
    import store from "../store/store";
    import {common} from '../assets/common'

    export default {
        name: 'common-header',
        data() {
            return {
                langList: common.langList,
                currentLang: common.langList[0]
            };
        },
        methods: {
            initLangInfo() {
                let currentTag = !!localStorage.getItem('locale') ? localStorage.getItem('locale') : this.$i18n.locale;

                for (let index = 0 ;index < common.langList.length; index++) {
                    let langObj = common.langList[index];

                    if (langObj.tag === currentTag) {
                        this.currentLang = langObj;
                        break;
                    }
                }
            },
            updateCollapse() {
                store.commit('common/updateCollapse', !this.isCollapse);
            },
            updateLang(langTag) {
                if (langTag !== this.currentLang.tag) {
                    localStorage.setItem('locale', langTag);
                    for (let index = 0 ;index < this.langList.length; index++) {
                        let langObj = this.langList[index];

                        if (langObj.tag === langTag) {
                            this.currentLang = langObj;
                            this.$i18n.locale = langTag;
                            break;
                        }
                    }
                }
            },
            logOut() {
                store.commit('common/updateLogin', false);
                this.$router.push('/');
            }
        },
        computed: {
            isLogin: function () {
                return store.state.common.isLogin;
            },
            isCollapse: function () {
                return store.state.common.isCollapse;
            }
        },
        created() {
            this.initLangInfo();
        }
    };
</script>

<style lang="scss" scoped>
    #header{
        height: 60px;
        .logo{
            float: left;
            img{
                color: #fff;
            }
        }
        .header-right{
            margin-left: 215px;
            height: 100%;
            .collapse-icon{
                font-size: 30px;
                color: #66696F;
                margin-top: 15px;
                cursor: pointer;
            }
            .right{
                float: right;
                margin-top: 16px;
                .user-info{
                    span{
                        position: relative;
                        top: -6px;
                    }
                }
                .lang{
                    svg{
                        width: 2em;
                        height: 2em;
                    }
                    span{
                        position: relative;
                        top: -6px;
                    }
                }
            }
        }
    }
    .has-login{
        .logo{
            img{
                height: 50px;
                padding: 5px 0;
            }
        }
    }
</style>
