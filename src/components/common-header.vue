<template>
    <div id="header" class="pad-hor">
        <div class="header-left">
            <router-link class="logo" :to="{path: isLogin ? '/modules-main/system-overview' : '/'}">
                <img src="../assets/img/logo.png" alt="Teleport">
            </router-link>
            <el-dropdown class="lang pad-rgt" trigger="click" @command="updateLang">
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
            <i v-if="isLogin" class="collapse-icon" v-bind:class="{'el-icon-s-unfold': isCollapse, 'el-icon-s-fold': !isCollapse}"
               @click="updateCollapse">
            </i>
        </div>
        <div class="header-right">
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        .header-left{
            img{
                color: #fff;
            }
            .lang{
                position: relative;
                top: -20px;
            }
            .collapse-icon{
                position: relative;
                top: -15px;
                font-size: 30px;
                color: #66696F;
                cursor: pointer;
            }
        }
        .header-right{

        }
    }
</style>
