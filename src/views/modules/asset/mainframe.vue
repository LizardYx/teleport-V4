<template>
    <div id="mainframe">
        <el-breadcrumb id="pageTitle" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>主机管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="pageContent">
            <el-row :gutter="20" class="tool-bar">
                <el-col :span="18">
                    <el-button size="mini" type="primary">
                        <i class="el-icon-circle-plus-outline"></i>
                        添加主机
                    </el-button>
                    <el-button size="mini" type="primary">
                        <i class="el-icon-circle-plus-outline"></i>
                        导入主机和账号
                    </el-button>
                    <el-button size="mini" type="primary">
                        <i class="el-icon-remove"></i>
                        禁用
                    </el-button>
                    <el-button size="mini" type="primary">
                        <i class="el-icon-success"></i>
                        解禁
                    </el-button>
                    <el-button size="mini" type="primary">
                        <i class="el-icon-delete"></i>
                        删除
                    </el-button>
                    <el-button size="mini" type="primary" @click="getHostList">
                        <i class="el-icon-refresh"></i>
                        刷新列表
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <el-input :class="{'search': true, 'searching': !!filter.searchValue}" prefix-icon="el-icon-search"
                              size="mini" v-model="filter.searchValue" placeholder="搜索：主机IP/名称/描述/资产编号"
                              maxlength="50">
                    </el-input>
                </el-col>
            </el-row>
            <div class="mar-btm">
                <el-table :data="tableData" border @selection-change="updateSelected" @sort-change="updateFilter">
                    <el-table-column align="center" type="selection">
                    </el-table-column>
                    <el-table-column header-align="center" prop="name" sortable="custom" label="主机名称">
                    </el-table-column>
                    <el-table-column header-align="center" prop="ip" label="IP地址"></el-table-column>
                    <el-table-column header-align="center" prop="os_type" sortable="custom" label="操作系统">
                        <template slot-scope="scope">
                            <i v-bind:class="{'iconfont': true, 'windows': isWindows(scope['row']['os_type']),
                            'linux': !isWindows(scope['row']['os_type'])}">
                            </i>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" prop="cid" sortable="custom" label="资产编号">
                    </el-table-column>
                    <el-table-column header-align="center" prop="acc_count" label="账号数"></el-table-column>
                    <el-table-column sortable="custom" label="状态" align="center">
                        <template slot-scope="scope">
                            <el-tag effect="dark" v-text="getHostsStatusInfo(scope['row'].state).name"
                                    :type="getHostsStatusInfo(scope['row'].state).css">
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" label="操作">
                        <a class="mar-rgt">禁用</a>
                        <a class="mar-rgt">解禁</a>
                    </el-table-column>
                </el-table>
            </div>
            <div class="block clearfix pagination">
                <el-pagination
                    @size-change="pageSizeChange"
                    @current-change="changeCurrentPage"
                    :current-page="filter.pageNation.pageNo"
                    :page-sizes="filter.pageNation.pageList"
                    :page-size="filter.pageNation.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="filter.pageNation.totalItem" background>
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {asyncGet} from '../../../assets/axios'
    import {api} from "../../../assets/api";

    export default {
        name: 'mainframe',
        data() {
            return {
                filter: {
                    pageNation: this.common.initPageNation(),
                    searchValue: '',
                    sort: {
                        name: '',
                        order: ''
                    }
                },
                selectedIdList: [],
                tableData: [],
                hostsStatusList: this.common.statusList,
                osTypeList: this.common.osTypeList
            }
        },
        methods: {
            initPageInfo() {
                this.getHostList();
            },
            updateFilter(column) {
                this.filter.sort = {
                    name: column.prop,
                    order: column.order
                };
            },
            getHostList() {
                let params = {
                    pageNo: this.filter.pageNation.pageNo,
                    pageSize: this.filter.pageNation.pageSize
                };

                !!this.filter.searchValue ? params.search = this.filter.searchValue : '';
                if (!!this.filter.sort.order) {
                    params.sort = {
                        name: this.filter.sort.name,
                        order: this.filter.sort.order
                    };
                }

                asyncGet(api.getHostsList, params)
                    .then((response) => {
                        let res = response && response.rows ? response.rows : {};

                        this.tableData = res && res.data ? res.data : [];
                        this.filter.pageNation.totalItem = res && res.count ? res.count : 0;
                    }, (error) => {
                        this.$notify({
                            type: 'warning',
                            message: error.msg,
                            duration: 5000
                        });
                    })
            },
            updateSelected(selectedItemList) {
                let selectedIdList = [];

                selectedItemList.forEach(function (selectedItemObj) {
                    selectedIdList.push(selectedItemObj['_id']);
                });
                this.selectedIdList = selectedIdList;
            },
            pageSizeChange(newPageSize) {
                this.filter.pageNation.pageSize = newPageSize;
                this.filter.pageNation.pageNo = 1;
                this.getHostList();
            },
            changeCurrentPage(newPageNo) {
                this.filter.pageNation.pageNo = newPageNo;
                this.getHostList();
            },
            getHostsStatusInfo(statusId) {
                let statusInfo = '';

                if (statusId) {
                    for (let index = 0; index < this.hostsStatusList.length; index++) {
                        let hostsStatusObj = this.hostsStatusList[index];

                        if (hostsStatusObj.id === statusId) {
                            statusInfo = hostsStatusObj;
                            break;
                        }
                    }
                }
                return !!statusInfo ? statusInfo : '-';
            },
            isWindows(osTypeId) {
                return osTypeId === this.osTypeList[0].id;
            }
        },
        created() {
            this.initPageInfo();
        }
    };
</script>

<style lang="scss" scoped>

</style>
