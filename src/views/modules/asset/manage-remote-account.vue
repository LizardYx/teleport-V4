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
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]">
                        {{$t('i18n.管理远程账号.禁用')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]">
                        {{$t('i18n.管理远程账号.解禁')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]">
                        <i class="el-icon-delete"></i>
                        {{$t('i18n.管理远程账号.删除')}}
                    </el-button>
                    <el-button size="mini" type="primary" @click="getAccountList">
                        <i class="el-icon-refresh"></i>
                        {{$t('i18n.管理远程账号.刷新列表')}}
                    </el-button>
                </el-col>
            </el-row>
            <div class="mar-btm">
                <el-table :data="accountList" border @selection-change="updateSelected">
                    <el-table-column align="center" type="selection"></el-table-column>
                    <el-table-column header-align="center" prop="username" :label="$t('i18n.管理远程账号.账号')">
                    </el-table-column>
                    <el-table-column header-align="center" class="protocol" :label="$t('i18n.管理远程账号.协议')">
                        <template slot-scope="scope">
                            <icon-svg :icon-class="getProtocolInfo(scope['row']['protocol_type']).icon">
                            </icon-svg>
                            <span v-text="getProtocolInfo(scope['row']['protocol_type']).name"></span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :label="$t('i18n.管理远程账号.认证方式')">
                        <template slot-scope="scope">
                            <span v-text="getAuthName(scope['row']['auth_type'])"></span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :label="$t('i18n.管理远程账号.状态')">
                        <template slot-scope="scope">
                            <el-tag effect="dark" v-text="getStatusInfo(scope['row'].state).name"
                                    :type="getStatusInfo(scope['row'].state).css">
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" :label="$t('i18n.主机管理页面.操作')">
                        <template slot-scope="scope">
                            <el-link type="primary" :underline="false" v-text="$t('i18n.主机管理页面.禁用')" class="mar-rgt">
                            </el-link>
                            <el-link type="primary" :underline="false" v-text="$t('i18n.主机管理页面.解禁')" class="mar-rgt">
                            </el-link>
                            <el-dropdown trigger="click">
                                <span>
                                    {{$t('i18n.主机管理页面.更多操作')}}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown" class="operation">
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" v-text="$t('i18n.主机管理页面.编辑详情')">
                                        </el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" v-text="$t('i18n.主机管理页面.删除')">
                                        </el-link>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="block clearfix">
                <el-row>
                    <el-col :span="12" :offset="12">
                        <div class="pagination">
                            <el-pagination
                                @size-change="pageSizeChange"
                                @current-change="changeCurrentPage"
                                :pager-count='5'
                                :current-page="filter.pageNation.pageNo"
                                :page-sizes="filter.pageNation.pageList"
                                :page-size="filter.pageNation.pageSize"
                                layout="total, sizes, prev, pager, next"
                                :total="filter.pageNation.totalItem" background>
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    import {asyncGet} from '../../../assets/axios'
    import {api} from "../../../assets/api";

    export default {
        name: "manage-remote-account",
        data() {
            return {
                filter: {
                    pageNation: this.common.initPageNation(),
                },
                selectedIdList: [],
                hostInfo: {
                    id: this.$route.query['id'],
                    name: this.$route.query['name']
                },
                accountList: [],
                statusList: this.common.statusList,
                protocolTypeList: this.common.protocolTypeList,
                authTypeList: this.common.authTypeList
            }
        },
        methods: {
            initPageInfo() {
                this.getAccountList();
            },
            getAccountList() {
                let params = {
                    host_id: this.hostInfo.id,
                    pageNo: this.filter.pageNation.pageNo,
                    pageSize: this.filter.pageNation.pageSize
                };

                asyncGet(api.getHostAccountList, params)
                    .then((response) => {
                        let res = response && response.rows ? response.rows : {};

                        this.accountList = res && res.data ? res.data : [];
                        this.filter.pageNation.totalItem = res && res.count ? res.count : 0;
                    }, (error) => {
                        this.$notify({
                            type: 'warning',
                            message: error.msg,
                            duration: 5000
                        });
                    })
            },
            pageSizeChange(newPageSize) {
                this.filter.pageNation.pageSize = newPageSize;
                this.filter.pageNation.pageNo = 1;
                this.getAccountList();
            },
            changeCurrentPage(newPageNo) {
                this.filter.pageNation.pageNo = newPageNo;
                this.getAccountList();
            },
            updateSelected(selectedItemList) {
                let selectedIdList = [];

                selectedItemList.forEach(function (selectedItemObj) {
                    selectedIdList.push(selectedItemObj['_id']);
                });
                this.selectedIdList = selectedIdList;
            },
            getProtocolInfo(protocolType) {
                let protocolTypeInfo = {
                    name: '',
                    icon: ''
                };

                if (protocolType) {
                    for (let protocolTypeObj of this.protocolTypeList) {
                        if (protocolTypeObj.id === protocolType) {
                            protocolTypeInfo = {
                                name: protocolTypeObj.name,
                                icon: protocolTypeObj.icon
                            };
                            break;
                        }
                    }
                }
                return protocolTypeInfo;
            },
            getStatusInfo(statusId) {
                let statusInfo = {
                    name: '',
                    css: ''
                };

                if (statusId) {
                    for (let statusObj of this.statusList) {
                        if (statusObj.id === statusId) {
                            statusInfo = {
                                name: statusObj.name,
                                css: statusObj.css
                            };
                            break;
                        }
                    }
                }
                return statusInfo;
            },
            getAuthName(authId) {
                let authName = '';

                if (authId) {
                    for (let authTypeObj of this.authTypeList) {
                        if (authTypeObj.id === authId) {
                            authName = authTypeObj.name;
                            break;
                        }
                    }
                }
                return !!authName ? authName : '-';
            }
        },
        created() {
            this.initPageInfo();
        }
    }
</script>

<style lang="scss" scoped>
#manageRemoteAccount{
    table{
        svg{
            font-size: 1.6em;
        }
    }
}
</style>
