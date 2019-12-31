<template>
    <div id="modulesMain">
        <el-container class="content">
            <el-header class="pad-no">
                <common-header></common-header>
            </el-header>
            <el-container>
                <el-aside id="nav" width="auto">
                    <el-menu class="bord-no" :default-active="$route.path" router :unique-opened="true" :collapse="isCollapse"
                             background-color="transparent" text-color="#c3c3c3" active-text-color="#fff">
                        <el-menu-item index="/modules-main/system-overview">
                            <i class="el-icon-menu"></i>
                            <span slot="title" v-text="$t('i18n.导航页面.系统总览')"></span>
                        </el-menu-item>
                        <el-submenu index="/modules-main/asset">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span slot="title" v-text="$t('i18n.导航页面.资产')"></span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="/modules-main/asset/mainframe">
                                    {{$t('i18n.导航页面.主机管理')}}
                                </el-menu-item>
                                <el-menu-item index="2-2">{{$t('i18n.导航页面.主机分组管理')}}</el-menu-item>
                                <el-menu-item index="2-3">{{$t('i18n.导航页面.账号分组管理')}}</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span slot="title" v-text="$t('i18n.导航页面.用户')"></span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="3-1">{{$t('i18n.导航页面.用户管理')}}</el-menu-item>
                                <el-menu-item index="3-2">{{$t('i18n.导航页面.用户分组管理')}}</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="4">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span slot="title" v-text="$t('i18n.导航页面.运维')"></span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="4-1">{{$t('i18n.导航页面.运维授权')}}</el-menu-item>
                                <el-menu-item index="4-2">{{$t('i18n.导航页面.主机运维')}}</el-menu-item>
                                <el-menu-item index="4-3">{{$t('i18n.导航页面.在线会话')}}</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="5">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span slot="title" v-text="$t('i18n.导航页面.审计')"></span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="5-1">{{$t('i18n.导航页面.审计授权')}}</el-menu-item>
                                <el-menu-item index="5-2">{{$t('i18n.导航页面.会话审计')}}</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="6">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span slot="title" v-text="$t('i18n.导航页面.系统')"></span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="6-1">{{$t('i18n.导航页面.系统日志')}}</el-menu-item>
                                <el-menu-item index="6-2">{{$t('i18n.导航页面.角色管理')}}</el-menu-item>
                                <el-menu-item index="6-3">{{$t('i18n.导航页面.系统设置')}}</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-menu-item index="7">
                            <i class="el-icon-setting"></i>
                            <span slot="title" v-text="$t('i18n.导航页面.助手设置')"></span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-container id="content">
                    <el-main id="mainContent" v-bind:class="{'fixed-tool-bar': isFixToolBar, 'isCollapse': isCollapse}">
                        <router-view></router-view>
                    </el-main>
                    <el-footer height="40px">
                        <copy-right></copy-right>
                    </el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import Vue from 'vue';
    import CommonHeader from '@src/components/common-header';
    import CopyRight from '@src/components/copy-right';
    import store from "@src/store/store";
    import {common} from "@src/assets/common";

    Vue.prototype.common = common;
    export default {
        name: "modulesMain",
        components: {CommonHeader, CopyRight},
        data() {
            return {

            }
        },
        computed: {
            isCollapse: function () {
                return store.state.common.isCollapse;
            },
            isFixToolBar: function () {
                return store.state.common.fixToolbar;
            }
        },
        methods: {

        }
    }
</script>

<style lang="scss">
    #modulesMain{
        background: url("../../assets/img/bg-img.jpg") no-repeat;
        background-size: 100%;
        > .content{
            height: 100vh;
            overflow-y: hidden;
        }
        #nav{
            overflow-y: auto;
            background-color: transparent;
            .el-submenu__title:hover{
                background-color: transparent !important;
            }
            li:hover{
                background-color: transparent !important;
                color: #fff !important;
            }
        }
        #content{
            height: calc(100vh - 60px);
            #mainContent{
                background-color: #EEEFF1;
                height: 100%;
                padding-bottom: 0;
                > div{
                    height: 100%;
                    #pageTitle{
                        font-size: 20px;
                        padding: 15px 0 30px;
                        .page-title{
                            font-size: 20px;
                        }
                    }
                    #pageContent{
                        background-color: #fff;
                        padding: 15px 20px;
                        .tool-bar{
                            margin-bottom: 30px;
                            .search{
                                input{
                                    float: left;
                                    min-width: 225px;
                                }
                            }
                        }
                        .notice{
                            .title{
                                font-weight: 600;
                                font-size: 16px;
                                color: $color-warning;
                            }
                        }
                        .pagination{
                            .el-pagination{
                                float: right;
                            }
                        }
                    }
                }
                &.fixed-tool-bar{
                    #pageContent{
                        padding-top: 77px;
                        .tool-bar{
                            position: fixed;
                            top: 60px;
                            display: flex;
                            left: 240px;
                            right: 55px;
                            align-items: center;
                            z-index: 10;
                            height: 50px;
                            box-shadow: 0 3px 15px rgba(0, 0, 0, 0.25);
                            background-color: #EEEFF1;
                        }
                    }
                }
                &.isCollapse{
                    #pageContent{
                        .tool-bar{
                            left: 104px;
                        }
                    }
                }
            }
        }
        footer{
            background-color: #EEEFF1;
        }
    }
</style>
