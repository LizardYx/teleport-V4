<template>
    <div id="manageRemoteAccount">
        <div id="pageTitle">
            <el-breadcrumb class="page-title mar-btm" separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>{{hostInfo.name}}</el-breadcrumb-item>
            </el-breadcrumb>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>{{$t('i18n.导航页面.资产')}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/modules-main/asset/mainframe'}">
                    {{$t('i18n.导航页面.主机管理')}}
                </el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('i18n.主机管理页面.管理远程账号')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{hostInfo.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div id="pageContent">
            <el-row :gutter="20" class="tool-bar">
                <el-col :span="18">
                    <el-button size="mini" type="primary">
                        <i class="el-icon-circle-plus-outline"></i>
                        {{$t('i18n.管理远程账号.添加账号')}}
                    </el-button>
                    <el-button size="mini" type="primary">
                        {{$t('i18n.管理远程账号.禁用')}}
                    </el-button>
                    <el-button size="mini" type="primary">
                        {{$t('i18n.管理远程账号.解禁')}}
                    </el-button>
                    <el-button size="mini" type="primary">
                        <i class="el-icon-delete"></i>
                        {{$t('i18n.管理远程账号.删除')}}
                    </el-button>
                    <el-button size="mini" type="primary" @click="getHostList">
                        <i class="el-icon-refresh"></i>
                        {{$t('i18n.管理远程账号.刷新列表')}}
                    </el-button>
                </el-col>
            </el-row>
            <div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "manage-remote-account",
        data() {
            return {
                hostInfo: {
                    id: this.$route.query['id'],
                    name: this.$route.query['name']
                }
            }
        },
        methods: {

        }
    }
</script>

<style lang="scss" scoped>

</style>
