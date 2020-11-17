<template>
    <div id="userGroupDetails">
        <el-breadcrumb id="pageTitle" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>运维策略</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="pageContent">
            <el-row :gutter="20" class="tool-bar">
                <el-col :span="18">
                    <el-button size="mini" type="primary">
                        <i class="el-icon-circle-plus-outline"></i>
                        新建授权策略
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]">
                        禁用策略
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]">
                        解禁策略
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]">
                        <i class="el-icon-delete"></i>
                        移除策略
                    </el-button>
                    <el-button size="mini" type="primary" @click="getAuthList()">
                        <i class="el-icon-refresh"></i>
                        刷新列表
                    </el-button>
                </el-col>
                <el-col :span="6"></el-col>
            </el-row>
            <div class="mar-btm">
                <el-table :data="authList" border @selection-change="updateSelected">
                    <el-table-column min-width="5%" align="center" type="selection"></el-table-column>
                    <el-table-column min-width="55%" header-align="center" prop="name" label="授权策略">
                        <template slot-scope="scope">
                            <el-popover placement="right" trigger="hover" :content="scope.row.desc">
                                <span slot="reference">
                                    <router-link :to="{path: '/modules-main/user/user-group-details', query: {id: scope.row.id, name: scope.row.name}}">
                                        {{scope.row.name}}
                                    </router-link>
                                </span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" align="center" prop="status" label="状态">
                        <template slot-scope="scope">
                            <el-tag effect="dark" v-text="getUserStatusInfo(scope['row'].state).name"  size="small"
                                    :type="getUserStatusInfo(scope['row'].state).css">
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" align="center" label="操作">
                        <template slot-scope="scope">
                            <el-link type="primary" class="mar-rgt" :underline="false">
                                编辑
                            </el-link>
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
        <fix-tool-bar ref="toolbar"></fix-tool-bar>
    </div>
</template>

<script>
    import {asyncGet, asyncPost} from '@src/assets/axios'
    import {api} from "@src/assets/api";
    import FixToolBar from  "@src/components/fix-tool-bar"
    import Sortable from "sortablejs";

    export default {
        name: "authorization",
        components: {FixToolBar, Sortable},
        data() {
            return{
                filter: {
                    pageNation: this.common.initPageNation(),
                },
                selectedIdList: [],
                authList: [],
                statusList: this.common.statusList,
            }
        },
        methods: {
            initPageInfo() {
                this.getAuthList();
            },
            getAuthList() {
                let params = {
                    pageNo: this.filter.pageNation.pageNo,
                    pageSize: this.filter.pageNation.pageSize
                };

                asyncGet(api.getPoliciesList, params)
                    .then((response) => {
                        let res = response && response.rows ? response.rows : {};

                        this.authList = res && res.data ? res.data : [];
                        this.filter.pageNation.totalItem = res && res.count ? res.count : 0;
                        this.selectedIdList = [];
                    }, (error) => {
                        this.common.notification('warning', error.msg);
                    })
            },
            pageSizeChange(newPageSize) {
                this.filter.pageNation.pageSize = newPageSize;
                this.filter.pageNation.pageNo = 1;
                this.getAuthList();
            },
            changeCurrentPage(newPageNo) {
                this.filter.pageNation.pageNo = newPageNo;
                this.getAuthList();
            },
            updateSelected(selectedItemList) {
                let selectedIdList = [];

                selectedItemList.forEach(function (selectedItemObj) {
                    selectedIdList.push(selectedItemObj.id);
                });
                this.selectedIdList = selectedIdList;
            },
            getUserStatusInfo(statusId) {
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
            rowDrop() {
                const that = this;

                const tbody = document.querySelector(".el-table__body-wrapper tbody");
                Sortable.create(tbody, {
                    onUpdate(evt) {
                        that.updateSort(evt.oldIndex, evt.newIndex)
                    }
                });
            },
            updateSort(oldIndex, newIndex) {
                const fromItem = this.authList[oldIndex];
                const targetItem = this.authList[newIndex];
                const direct = oldIndex - newIndex > 0 ? 1 : -1;
                let params = {
                    pid: fromItem.id,
                    new_rank: targetItem.rank,
                    start_rank: direct === 1 ? targetItem.rank : fromItem.rank + 1,
                    end_rank: direct === 1 ? fromItem.rank - 1 : targetItem.rank,
                    direct: direct
                };

                asyncPost(api.updatePoliciesOrder, params)
                    .then(() => {
                        this.common.notification('success', "授权策略顺序调整成功");
                        this.getAuthList();
                    }, (error) => {
                        this.common.notification('warning', error.msg);
                    })
            },
        },
        created() {
            this.initPageInfo();
        },
        mounted() {
            this.rowDrop();
            this.$refs.toolbar.fixToolBarInit(100);
        },
        beforeDestroy() {
            this.$refs.toolbar.removeFixToolBar();
        }
    }
</script>

<style scoped>

</style>
