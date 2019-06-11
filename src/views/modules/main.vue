<template>
    <div id="modulesMain">
        <el-container class="content">
            <el-header class="bord-btm">
                <common-header></common-header>
            </el-header>
            <el-container>
                <el-aside id="nav" class="bord-rgt" width="auto">
                    <el-radio-group v-model="isCollapse" class="mar-btm">
                        <el-radio-button :label="false">展开</el-radio-button>
                        <el-radio-button :label="true">收起</el-radio-button>
                    </el-radio-group>
                    <el-menu class="bord-no" default-active="1-1" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span slot="title">导航一</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="1-1">选项1</el-menu-item>
                                <el-menu-item index="1-2">选项2</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group>
                                <el-menu-item index="1-3">选项3</el-menu-item>
                            </el-menu-item-group>
                            <el-submenu index="1-4">
                                <span slot="title">选项4</span>
                                <el-menu-item index="1-4-1">选项1</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                        <el-menu-item index="2">
                            <i class="el-icon-menu"></i>
                            <span slot="title">导航二</span>
                        </el-menu-item>
                        <el-menu-item index="3">
                            <i class="el-icon-setting"></i>
                            <span slot="title">导航三</span>
                        </el-menu-item>
                        <el-submenu index="4">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span slot="title">导航一</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="4-1">选项1</el-menu-item>
                                <el-menu-item index="4-2">选项2</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group>
                                <el-menu-item index="4-3">选项3</el-menu-item>
                            </el-menu-item-group>
                            <el-submenu index="4-4">
                                <span slot="title">选项4</span>
                                <el-menu-item index="4-4-1">选项1</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                        <el-submenu index="5">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span slot="title">导航一</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="5-1">选项1</el-menu-item>
                                <el-menu-item index="5-2">选项2</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group>
                                <el-menu-item index="5-3">选项3</el-menu-item>
                            </el-menu-item-group>
                            <el-submenu index="5-4">
                                <span slot="title">选项4</span>
                                <el-menu-item index="5-4-1">选项1</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-container>
                    <el-main>
                        <router-view></router-view>
                    </el-main>
                    <el-footer>
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

    export default {
        name: "modulesMain",
        components: {CommonHeader, copyRight},
        data() {
            return {
                isCollapse: false
            }
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>

<style lang="scss" scoped>
    #modulesMain{
        > .content{
            height: 100vh;
            overflow-y: hidden;
        }
        #nav{
            overflow-y: auto;
        }
    }
</style>
