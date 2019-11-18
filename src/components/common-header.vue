<template>
    <div id="header" class="pad-hor" v-bind:class="{'has-login basic-box-shadow': isLogin}">
        <router-link class="logo" :to="{path: isLogin ? '/modules-main/system-overview' : '/'}">
            <img src="../assets/img/logo.png" alt="Teleport">
        </router-link>
        <div class="header-right">
            <i v-if="isLogin" class="collapse-icon" v-bind:class="{'el-icon-s-unfold': isCollapse, 'el-icon-s-fold': !isCollapse}"
               @click="updateCollapse">
            </i>
            <el-dropdown trigger="click" @command="updateLang">
                <span>
                    <i class="iconfont" :class="currentLang.iconName"></i>
                    {{currentLang.name}}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu solt="dropdown">
                    <el-dropdown-item v-for="langObj in langList" :command="langObj.tag">
                        <i  class="iconfont" :class="langObj.iconName"></i>
                        {{langObj.name}}
                    </el-dropdown-item>
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
