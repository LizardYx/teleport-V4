<template>
    <div id="userGroup">
        <el-breadcrumb id="pageTitle" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>用户分组</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="pageContent">
            <el-row :gutter="20" class="tool-bar">
                <el-col :span="18">
                    <el-button size="mini" type="primary">
                        <i class="el-icon-circle-plus-outline"></i>
                        创建用户分组
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <el-input :class="{'search': true, 'searching': !!filter.searchValue}" prefix-icon="el-icon-search"
                              size="mini" placeholder="搜索：用户账号/姓名/邮箱/描述"
                              v-model="filter.searchValue" maxlength="50">
                    </el-input>
                </el-col>
            </el-row>
            <div class="mar-btm">
                <el-table :data="userList" border @selection-change="updateSelected" @sort-change="updateFilter"
                          @filter-change="filterChange">
                    <el-table-column min-width="5%" align="center" type="selection" :selectable="canSelectUser"></el-table-column>
                    <el-table-column min-width="15%" header-align="center" prop="username" sortable="custom" :label="$t('i18n.用户管理.名称')">
                    </el-table-column>
                    <el-table-column min-width="15%" header-align="center" prop="type" sortable="custom" :label="getUserTypeTile()"
                                     column-key="type" :filters="getUserTypeFilterList()" :filter-multiple="false">
                        <template slot-scope="scope">
                            {{getUserType(scope['row'].type)}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="13%" header-align="center" prop="role" sortable="custom" :label="getUserRoleTitle()"
                                     column-key="role" :filters="getUserRoleFilterList()" :filter-multiple="false">
                        <template slot-scope="scope">
                            {{getUserRole(scope['row']['role_id'])}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="10%" align="center" prop="status" sortable="custom" :label="getUserStatusTitle()"
                                     column-key="status" :filters="getStatusFilterList()" :filter-multiple="false">
                        <template slot-scope="scope">
                            <el-tag effect="dark" v-text="getUserStatusInfo(scope['row'].state).name"  size="small"
                                    :type="getUserStatusInfo(scope['row'].state).css">
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" align="center" :label="$t('i18n.用户管理.操作')">
                        <template slot-scope="scope" v-if="scope.$index !== 0">
                            <el-link type="primary" class="mar-rgt" :underline="false" v-text="$t('i18n.用户管理.禁用')"
                                     :disabled="scope['row'].state === statusList[1].id" @click="confirmDisabledUser([scope['row'].id])">
                            </el-link>
                            <el-link type="primary" class="mar-rgt" :underline="false" v-text="$t('i18n.用户管理.解禁')"
                                     :disabled="scope['row'].state === statusList[0].id" @click="confirmEnabledUser([scope['row'].id])">
                            </el-link>
                            <el-dropdown size="small" trigger="click">
                                <span>
                                    {{$t('i18n.用户管理.更多操作')}}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown" class="operation">
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" @click="initUserInfoDialog(scope['row'])">
                                            编辑用户信息
                                        </el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" @click="initUpdateRole([scope['row']['id']])">
                                            设置角色
                                        </el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" @click="initResetPassword(scope['row'])">
                                            重置密码
                                        </el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" @click="confirmResetOath(scope['row'].id)">
                                            重置身份验证器
                                        </el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" @click="initDeleteUser([scope['row'].id])">
                                            删除
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
        <fix-tool-bar ref="toolbar"></fix-tool-bar>
    </div>
</template>

<script>
    import {asyncGet, asyncPost} from '@src/assets/axios'
    import {api} from "@src/assets/api";
    import FixToolBar from  "@src/components/fix-tool-bar"

    export default {
        name: "user-group",
        data() {
            return{
                filter: {
                    pageNation: this.common.initPageNation(),
                    searchValue: '',
                    sort: {
                        name: '',
                        order: '',
                    },
                    type: '',
                    role: '',
                    status: ''
                },
                selectedIdList: [],
                groupList: []
            }
        },
        methods: {
            initPageInfo() {
                this.getUserGroupList();
            },
            updateFilter(column) {
                this.filter.sort = {
                    name: column.prop,
                    order: column.order
                };
                this.getUserGroupList();
            },
            filterChange(filterObj) {
                for (let key in filterObj) {
                    const filterValue = filterObj[key][0];

                    if (this.filter[key] !== filterValue) {
                        this.filter[key] = filterValue;
                        this.getUserGroupList();
                    }
                }
            },
            getUserGroupList() {

            },
            pageSizeChange(newPageSize) {
                this.filter.pageNation.pageSize = newPageSize;
                this.filter.pageNation.pageNo = 1;
                this.getUserGroupList();
            },
            changeCurrentPage(newPageNo) {
                this.filter.pageNation.pageNo = newPageNo;
                this.getUserGroupList();
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

<style lang="scss" scoped>
    #userGroup{

    }
</style>
