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
                    <el-table-column header-align="center" sortable="custom" label="主机名称">
                        <template slot-scope="scope">
                            <el-popover placement="right" trigger="hover">
                                <div v-html="getHostsRemarkInfo(scope['row'].desc)"></div>
                                <span v-text="scope['row'].name" slot="reference"></span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" prop="ip" label="IP地址"></el-table-column>
                    <el-table-column header-align="center" sortable="custom" label="操作系统">
                        <template slot-scope="scope">
                            <icon-svg icon-class="windows" v-if="isWindows(scope['row']['os_type'])"></icon-svg>
                            <icon-svg icon-class="linux" v-if="!isWindows(scope['row']['os_type'])"></icon-svg>
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
            <div class="block clearfix">
                <el-row>
                    <el-col :span="12">
                        <div class="notice">
                            <label class="title box-block">温馨提示：</label>
                            <div class="content">
                                <p>
                                    批量导入主机和账号需要上传.csv格式的文件，您可以下载
                                    <a href="../../../download/teleport-example-asset.csv"
                                       download="teleport-example-asset.csv">
                                        资产信息文件模板
                                    </a>
                                    进行编辑。
                                </p>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
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
            getHostsRemarkInfo(desc) {
                let content = '';

                if (desc !== '') {
                    content = desc.replace(/\r/g, '').replace(/\n/g, '<br/>');
                }
                return content;
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
