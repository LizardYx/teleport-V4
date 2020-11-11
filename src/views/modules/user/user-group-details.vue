<template>
    <div id="userGroupDetails">
        <div id="pageTitle">
            <el-breadcrumb class="page-title mar-btm" separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>{{groupInfo.name}}</el-breadcrumb-item>
            </el-breadcrumb>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>用户</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/modules-main/user/user-group'}">
                    用户分组管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>组内用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{groupInfo.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div id="pageContent">
            <el-row :gutter="20" class="tool-bar">
                <el-col :span="18">
                    <el-button size="mini" type="primary">
                        <i class="el-icon-circle-plus-outline"></i>
                        添加用户
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]">
                        <i class="el-icon-delete"></i>
                        移除用户
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <el-input :class="{'search': true, 'searching': !!filter.searchValue}" prefix-icon="el-icon-search"
                              size="mini" placeholder="搜索：用户账号/姓名/邮箱等"
                              v-model="filter.searchValue" maxlength="50">
                    </el-input>
                </el-col>
            </el-row>
            <div class="mar-btm">
                <el-table :data="userList" border @selection-change="updateSelected" @sort-change="updateFilter"
                          @filter-change="filterChange">
                    <el-table-column min-width="5%" align="center" type="selection"></el-table-column>
                    <el-table-column min-width="20%" header-align="center" prop="surname" sortable="custom" label="用户">
                    </el-table-column>
                    <el-table-column min-width="35%" header-align="center" label="成员信息">
                        <template slot-scope="scope">
                            {{scope['row'].username}} {{scope['row'].email}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" header-align="center" prop="role" sortable="custom" :label="getUserRoleTitle()"
                                     column-key="role" :filters="getUserRoleFilterList()" :filter-multiple="false">
                        <template slot-scope="scope">
                            {{getUserRoleName(scope['row']['role_id'])}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" align="center" prop="status" sortable="custom" :label="getUserStatusTitle()"
                                     column-key="status" :filters="getStatusFilterList()" :filter-multiple="false">
                        <template slot-scope="scope">
                            <el-tag effect="dark" v-text="getUserStatusInfo(scope['row'].state).name"  size="small"
                                    :type="getUserStatusInfo(scope['row'].state).css">
                            </el-tag>
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

    export default {
        name: "user-group-details",
        components: {FixToolBar},
        data() {
            return {
                filter: {
                    pageNation: this.common.initPageNation(),
                    searchValue: '',
                    sort: {
                        name: '',
                        order: '',
                    },
                    role: '',
                },
                groupInfo: {
                    id: this.$route.query['id'],
                    name: this.$route.query['name']
                },
                selectedIdList: [],
                userList: [],
                roleList: [],
                statusList: this.common.statusList,
            }
        },
        methods: {
            initPageInfo() {
                this.getUserGroupDetails();
                this.getRoleList();
            },
            updateFilter(column) {
                this.filter.sort = {
                    name: column.prop,
                    order: column.order
                };
                this.getUserGroupDetails();
            },
            filterChange(filterObj) {
                for (let key in filterObj) {
                    const filterValue = filterObj[key][0];

                    if (this.filter[key] !== filterValue) {
                        this.filter[key] = filterValue;
                        this.getUserGroupDetails();
                    }
                }
            },
            getUserGroupDetails() {
                let params = {
                    pageNo: this.filter.pageNation.pageNo,
                    pageSize: this.filter.pageNation.pageSize
                };

                !!this.filter.searchValue ? params.search = this.filter.searchValue : "";
                if (!!this.filter.sort.order) {
                    params.sort = {
                        name: this.filter.sort.name,
                        order: this.filter.sort.order
                    };
                }
                !!this.filter.role ? params.role = this.filter.role : '';
                !!this.filter.status ? params.stauts = this.filter.status : '';
                asyncGet(api.getUserGroupDetails, params)
                    .then((response) => {
                        let res = response && response.rows ? response.rows : {};

                        this.userList = res && res.data ? res.data : [];
                        this.filter.pageNation.totalItem = res && res.count ? res.count : 0;
                        this.selectedIdList = [];
                    }, (error) => {
                        this.common.notification('warning', error.msg);
                    })
            },
            getRoleList() {
                asyncGet(api.getRoleList)
                    .then((response) => {
                        let res = response && response.rows ? response.rows : {};

                        this.roleList = res && res.data ? res.data : [];
                    }, (error) => {
                        this.common.notification('warning', error.msg);
                    })
            },
            updateSelected(selectedItemList) {
                let selectedIdList = [];

                selectedItemList.forEach(function (selectedItemObj) {
                    selectedIdList.push(selectedItemObj.id);
                });
                this.selectedIdList = selectedIdList;
            },
            getUserRoleTitle() {
                let userRoleTitle = "全部";

                if (this.filter.role) {
                    for (let roleObj of this.roleList) {
                        if (roleObj.id === this.filter.role) {
                            userRoleTitle = roleObj.name;
                            break;
                        }
                    }
                }
                return `角色(${userRoleTitle})`;
            },
            getUserRoleFilterList() {
                let roleFilterList = [];

                this.roleList.forEach(function (roleObj) {
                    const newRoleFilterObj = {
                        text: roleObj.name,
                        value: roleObj.id
                    };

                    roleFilterList.push(newRoleFilterObj);
                });
                return roleFilterList;
            },
            getUserRoleName(roleId) {
                let roleName = '-';

                if (roleId) {
                    for (let roleObj of this.roleList) {
                        if (roleObj.id === roleId) {
                            roleName = roleObj.name;
                            break;
                        }
                    }
                }
                return roleName;
            },


            getUserStatusTitle() {
                let userStatusTitle = "全部";

                if (this.filter.status) {
                    for (let statusObj of this.statusList) {
                        if (statusObj.id === this.filter.status) {
                            userStatusTitle = statusObj.name;
                            break;
                        }
                    }
                }
                return `状态(${userStatusTitle})`;
            },
            getStatusFilterList() {
                let filterList = [];

                this.statusList.forEach(function (statusObj) {
                    const newFilterObj = {
                        text: statusObj.name,
                        value: statusObj.id
                    };

                    filterList.push(newFilterObj);
                });
                return filterList;
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
            pageSizeChange(newPageSize) {
                this.filter.pageNation.pageSize = newPageSize;
                this.filter.pageNation.pageNo = 1;
                this.getUserGroupDetails();
            },
            changeCurrentPage(newPageNo) {
                this.filter.pageNation.pageNo = newPageNo;
                this.getUserGroupDetails();
            },
        },
        created() {
            this.initPageInfo();
        },
        mounted() {
            this.$refs.toolbar.fixToolBarInit(100);
        },
        beforeDestroy() {
            this.$refs.toolbar.removeFixToolBar();
        }
    }
</script>

<style scoped>

</style>
