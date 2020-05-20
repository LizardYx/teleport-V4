<template>
    <div id="userGroup">
        <el-breadcrumb id="pageTitle" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>用户分组</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="pageContent">
            <el-row :gutter="20" class="tool-bar">
                <el-col :span="18">
                    <el-button size="mini" type="primary" @click="initUserGroupInfo">
                        <i class="el-icon-circle-plus-outline"></i>
                        创建用户分组
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="initDeleteGroup(selectedIdList)">
                        <i class="el-icon-delete"></i>
                        删除
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <el-input :class="{'search': true, 'searching': !!filter.searchValue}" prefix-icon="el-icon-search"
                              size="mini" placeholder="搜索：用户分组名称/描述"
                              v-model="filter.searchValue" maxlength="50">
                    </el-input>
                </el-col>
            </el-row>
            <div class="mar-btm">
                <el-table :data="groupList" border @selection-change="updateSelected" @sort-change="updateFilter"
                          @filter-change="filterChange">
                    <el-table-column min-width="5%" align="center" type="selection"></el-table-column>
                    <el-table-column min-width="20%" header-align="center" prop="name" sortable="custom" label="用户组">
                        <template slot-scope="scope">
                            <el-popover placement="right" trigger="hover" :content="scope.row.desc">
                                <span slot="reference">
                                    <router-link :to="{path: 'user/user-group-details'}">
                                        {{scope.row.name}}
                                    </router-link>
                                </span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="10%" header-align="center" prop="member_count" label="组成员数"></el-table-column>
                    <el-table-column min-width="35%" header-align="center" label="组成员用户">
                        <template slot-scope="scope">
                            <el-tag size="small" type="info" v-for="memberObj in scope['row'].members" :command="memberObj.id" class="host-info"
                                    :key="memberObj.id" v-text="memberObj.surname">
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" align="center" label="操作">
                        <template slot-scope="scope">
                            <el-link type="primary" class="mar-rgt" :underline="false" @click="initUserGroupInfo(scope['row'])">
                                编辑
                            </el-link>
                            <el-link type="primary" class="mar-rgt" :underline="false" @click="initDeleteGroup([scope['row'].id])">
                                     删除
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
            <el-dialog :title="userGroupInfoDialog.title" :visible.sync="userGroupInfoDialog.visible" width="768px"
                       :close-on-click-modal="false" :close-on-press-escape="false" v-if="userGroupInfoDialog.visible">
                <el-form :model="userGroupInfoDialog" status-icon :rules="userGroupInfoDialog.rules" ref="userGroupInfoDialog"
                         size="medium">
                    <el-row>
                        <el-col :span="10">
                            <el-form-item prop="name" label="名称:" label-width="120px">
                                <el-input v-model="userGroupInfoDialog.name" placeholder="请输入用户分组名称" size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="简要描述:" label-width="120px">
                                <el-input type="textarea" :rows="3" v-model="userGroupInfoDialog.desc" size="mini"
                                          placeholder="请输入用户分组描述">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="submitUserGroupInfo()">
                        <icon-svg icon-class="submit"></icon-svg>
                        确定
                    </el-button>
                    <el-button size="mini" @click="cancelUserGroupDialog()">
                        <icon-svg icon-class="cancel"></icon-svg>
                        取消
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="deleteGroupDialog.visible" v-if="deleteGroupDialog.visible" class="delete-dialog"
                       width="768px" :close-on-click-modal="false" :close-on-press-escape="false">
                <div slot="title" class="delete-title">
                    <icon-svg icon-class="warning"></icon-svg>操作确认
                </div>
                <div class="warning">
                    <div class="text-bold">注意：删除操作不可恢复！！</div>
                    <ul>
                        <li>删除用户组将同时删除所有分配给此用户组的授权！</li>
                        <li>删除用户组不会删除组内的用户账号！</li>
                    </ul>
                </div>
                <div class="mar-top">
                    您确定要"删除"选中的 <span class="text-bold">{{deleteGroupDialog.idList.length}}个</span> 用户分组？<br/>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="deleteGroup">确定</el-button>
                    <el-button size="mini" @click="deleteGroupDialog.visible = false">取消</el-button>
                </div>
            </el-dialog>
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
        components: {FixToolBar},
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
                groupList: [],
                userGroupInfoDialog: {
                    visible: false
                },
                deleteGroupDialog: {
                    visible: false
                }
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
                asyncGet(api.getUserGroupList, params)
                    .then((response) => {
                        let res = response && response.rows ? response.rows : {};

                        this.groupList = res && res.data ? res.data : [];
                        this.filter.pageNation.totalItem = res && res.count ? res.count : 0;
                        this.selectedIdList = [];
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
            pageSizeChange(newPageSize) {
                this.filter.pageNation.pageSize = newPageSize;
                this.filter.pageNation.pageNo = 1;
                this.getUserGroupList();
            },
            changeCurrentPage(newPageNo) {
                this.filter.pageNation.pageNo = newPageNo;
                this.getUserGroupList();
            },

            // user group info start
            initUserGroupInfo(userGroupInfo) {
                this.userGroupInfoDialog = {
                    visible: true,
                    isCreate: !userGroupInfo,
                    title: !!userGroupInfo ? `编辑用户分组信息:${userGroupInfo.name}`: '创建用户分组',
                    name: !!userGroupInfo ? userGroupInfo.name : '',
                    desc: !!userGroupInfo ? userGroupInfo.desc : '',
                    rules: {
                        name: [{
                            required: true, message: '请输入用户分组名字', trigger: 'blur'
                        }],
                    }
                };
            },
            submitUserGroupInfo() {
                this.$refs['userGroupInfoDialog'].validate((passValidate) => {
                    if (passValidate) {
                        this.userGroupInfoDialog.isCreate ? this.createUserGroup() : this.updateUserGroup();
                    }else {
                        return false;
                    }
                })
            },
            createUserGroup() {
                // call API
                this.common.notification('success', '创建用户分组成功');
                this.userGroupInfoDialog.visible = false;
            },
            updateUserGroup() {
                // call API
                this.common.notification('success', '更新用户分组成功');
                this.userGroupInfoDialog.visible = false;
            },
            cancelUserGroupDialog() {
                this.$refs['userGroupInfoDialog'].resetFields();
                this.userGroupInfoDialog.visible = false;
            },
            // user group info end

            // delete group start
            initDeleteGroup(idList) {
                this.deleteGroupDialog = {
                    visible: true,
                    idList: idList
                };
            },
            deleteGroup() {
                //call API
                this.deleteGroupDialog.visible = false;
                this.filter.pageNation.pageNo = 1;
                this.getUserGroupList();
                this.common.notification('success', '删除用户分组成功');
            },
            // delete group end
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
        table{
            span.host-info{
                margin-right: 4px;
                margin-bottom: 4px;
            }
        }
    }
</style>
