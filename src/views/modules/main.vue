<template>
    <div id="modulesMain">
        <el-container class="content">
            <el-header class="bord-btm pad-no">
                <common-header></common-header>
            </el-header>
            <el-container>
                <el-aside id="nav" class="bord-rgt" width="auto">
                    <el-menu class="bord-no" :default-active="$route.path" router :unique-opened="true" :collapse="isCollapse"
                             background-color="#66696F" text-color="#c3c3c3" active-text-color="#fff">
                        <el-menu-item index="/modules-main/system-overview">
                            <i class="el-icon-menu"></i>
                            <span slot="title">系统总览</span>
                        </el-menu-item>
                        <el-submenu index="/modules-main/asset">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span slot="title">资产</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="/modules-main/asset/mainframe">
                                    主机管理
                                </el-menu-item>
                                <el-menu-item index="2-2">主机分组管理</el-menu-item>
                                <el-menu-item index="2-3">账号分组管理</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span slot="title">用户</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="3-1">用户管理</el-menu-item>
                                <el-menu-item index="3-2">用户分组管理</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="4">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span slot="title">运维</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="4-1">运维授权</el-menu-item>
                                <el-menu-item index="4-2">主机运维</el-menu-item>
                                <el-menu-item index="4-3">在线会话</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="5">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span slot="title">审计</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="5-1">审计授权</el-menu-item>
                                <el-menu-item index="5-2">会话审计</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="6">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span slot="title">系统</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="6-1">系统日志</el-menu-item>
                                <el-menu-item index="6-2">角色管理</el-menu-item>
                                <el-menu-item index="6-3">系统设置</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-menu-item index="7">
                            <i class="el-icon-setting"></i>
                            <span slot="title">助手设置</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-container>
                    <el-main class="mainContent">
                        <router-view></router-view>
                    </el-main>
                    <el-footer height="40px">
                        <copyRight></copyRight>
                    </el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import CommonHeader from '../../components/common-header';
    import copyRight from '../../components/copy-right';
    import store from "../../store/store";

    export default {
        name: "modulesMain",
        components: {CommonHeader, copyRight},
        data() {
            return {

            }
        },
        computed: {
            isCollapse: function () {
                return store.state.common.isCollapse;
            }
        },
        methods: {

        }
    }
</script>

<style lang="scss">
    #modulesMain{
        > .content{
            height: 100vh;
            overflow-y: hidden;
        }
        #nav{
            overflow-y: auto;
            background-color: #66696F;
        }
        .mainContent{
            background-color: #d1d4d85e;
            height: 100%;
            padding-bottom: 0;
            overflow-y: hidden;
            > div{
                height: 100%;
                #pageTitle{
                    font-size: 20px;
                    padding: 15px 0 30px;
                }
                #pageContent{
                    background-color: #fff;
                    padding: 15px 20px;
                    .tool-bar{
                        margin-bottom: 30px;
                        .search{
                            input{
                                width: 50%;
                                min-width: 150px;
                                float: right;
                                transition: width 0.5s;
                                -moz-transition: width 0.5s; /* Firefox 4 */
                                -webkit-transition: width 0.5s; /* Safari 和 Chrome */
                                -o-transition: width 0.5s; /* Opera */
                            }
                            input:focus{
                                width: 100%;
                                transition: width 0.5s;
                                -moz-transition: width 0.5s; /* Firefox 4 */
                                -webkit-transition: width 0.5s; /* Safari 和 Chrome */
                                -o-transition: width 0.5s; /* Opera */
                            }
                        }
                    }
                }
            }
        }
        footer{
            background-color: #d1d4d85e;
        }
    }
</style>
