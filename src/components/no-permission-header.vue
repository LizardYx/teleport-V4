<template>
    <div id="header">
        <img class="logo" src="../assets/img/logo.png" alt="Teleport">
        <div class="header-right pad-rgt">
            <div class="right">
                <el-dropdown class="lang" trigger="click" @command="updateLang">
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
    import {common} from '../assets/common'

    export default {
        name: 'no-permission-header',
        data() {
            return {
                langList: common.langList,
                currentLang: common.langList[0],
            }
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
        },
        created() {
            this.initLangInfo();
        }
    };
</script>

<style lang="scss" scoped>
    #header{
        .logo{
            float: left;
            color: #fff;
        }
        .header-right{
            margin-left: 215px;
            height: 100%;
            .right{
                float: right;
                margin-top: 16px;
                label{
                    svg{
                        width: 2em;
                        height: 2em;
                    }
                    span{
                        color: #fff;
                        position: relative;
                        top: -6px;
                    }
                }
            }
        }
    }
</style>
