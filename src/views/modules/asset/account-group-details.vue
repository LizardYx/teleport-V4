<template>
    <div id="accountGroupDetail">
            <div id="pageTitle">
                <el-breadcrumb class="page-title mar-btm" separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>{{groupInfo.name}}</el-breadcrumb-item>
                </el-breadcrumb>
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>{{$t('i18n.导航页面.资产')}}</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/modules-main/asset/account-group'}">
                        {{$t('i18n.导航页面.账号分组管理')}}
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>{{$t('i18n.组内账号管理.组内账号管理')}}</el-breadcrumb-item>
                    <el-breadcrumb-item>{{groupInfo.name}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div id="pageContent">
            <el-row :gutter="20" class="tool-bar">
                <el-col :span="18">
                    <el-button size="mini" type="primary" @click="initAccountJoinGroup()">
                        <i class="el-icon-circle-plus-outline"></i>
                        {{$t('i18n.组内账号管理.添加组成员账号')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="initRemoveAFromGroup(selectedIdList)">
                        {{$t('i18n.组内账号管理.移除组成员账号')}}
                    </el-button>
                    <el-button size="mini" type="primary" @click="getAccountList()">
                        <i class="el-icon-refresh"></i>
                        {{$t('i18n.组内账号管理.刷新列表')}}
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <el-input :class="{'search': true, 'searching': !!filter.searchValue}" prefix-icon="el-icon-search"
                              size="mini" :placeholder="$t('i18n.组内账号管理.搜索：账号/主机IP')"
                              v-model="filter.searchValue" maxlength="50">
                    </el-input>
                </el-col>
            </el-row>
            <div class="mar-btm">
                <el-table :data="accountList" border @selection-change="updateSelected" @sort-change="updateFilter">
                    <el-table-column min-width="5%" align="center" type="selection"></el-table-column>
                    <el-table-column min-width="20%" prop="name" header-align="center" sortable="custom" :label="$t('i18n.组内账号管理.账号')">
                        <template slot-scope="scope">
                            {{scope['row'].username}}@{{scope['row'].hostInfo.ip}}({{scope['row'].hostInfo.name}})
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" prop="protocolType" align="center" sortable="custom" :label="$t('i18n.组内账号管理.远程连接协议')">
                        <template slot-scope="scope">
                            <el-tag size="small" type="info">
                                <icon-svg :icon-class="getProtocolInfo(scope['row']['protocol_type']).icon">
                                </icon-svg>
                                <span v-text="getProtocolInfo(scope['row']['protocol_type']).name"></span>
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" align="center" :label="$t('i18n.组内账号管理.认证方式')">
                        <template slot-scope="scope">
                            <span v-text="getAuthName(scope['row']['auth_type'])"></span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="15%" prop="status" align="center" sortable="custom" :label="$t('i18n.组内账号管理.状态')">
                        <template slot-scope="scope">
                            <el-tag effect="dark" v-text="getStatusInfo(scope['row'].state).name" size="small"
                                    :type="getStatusInfo(scope['row'].state).css">
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" align="center" :label="$t('i18n.组内账号管理.操作')">
                        <template slot-scope="scope">
                            <el-link type="primary" class="mar-rgt" :underline="false" v-text="$t('i18n.组内账号管理.移除组成员账号')"
                                     @click="initRemoveAFromGroup([scope['row']])">
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
            <el-dialog :title="$t('i18n.组内账号管理.添加组成员账号')" :visible.sync="joinGroupVisible" width="1000px"
                       :close-on-click-modal="false" :close-on-press-escape="false" v-if="joinGroupVisible">
                <el-row :gutter="20" class="tool-bar">
                    <el-col :span="18">
                        <el-button size="mini" type="primary" @click="getCanJoinGroupAccountList()">
                            <i class="el-icon-refresh"></i>
                            {{$t('i18n.组内账号管理.刷新列表')}}
                        </el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-input :class="{'search': true, 'searching': !!joinGroupDialog.filter.searchValue}" prefix-icon="el-icon-search"
                                  size="mini" :placeholder="$t('i18n.组内账号管理.搜索：账号/主机IP')"
                                  v-model="joinGroupDialog.filter.searchValue" maxlength="50">
                        </el-input>
                    </el-col>
                </el-row>
                <el-table :data="joinGroupDialog.accountList" border @selection-change="updateJoinGroupSelected"
                          @sort-change="updateJoinGroupFilter">
                    <el-table-column min-width="5%" align="center" type="selection"></el-table-column>
                    <el-table-column min-width="30%" prop="name" header-align="center" sortable="custom" :label="$t('i18n.组内账号管理.账号')">
                        <template slot-scope="scope">
                            {{scope['row'].username}}@{{scope['row'].hostInfo.ip}}({{scope['row'].hostInfo.name}})
                        </template>
                    </el-table-column>
                    <el-table-column min-width="25%" prop="protocolType" align="center" sortable="custom" :label="$t('i18n.组内账号管理.远程连接协议')">
                        <template slot-scope="scope">
                            <el-tag size="small" type="info">
                                <icon-svg :icon-class="getProtocolInfo(scope['row']['protocol_type']).icon">
                                </icon-svg>
                                <span v-text="getProtocolInfo(scope['row']['protocol_type']).name"></span>
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="25%" align="center" :label="$t('i18n.组内账号管理.认证方式')">
                        <template slot-scope="scope">
                            <span v-text="getAuthName(scope['row']['auth_type'])"></span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="15%" prop="status" align="center" sortable="custom" :label="$t('i18n.组内账号管理.状态')">
                        <template slot-scope="scope">
                            <el-tag effect="dark" v-text="getStatusInfo(scope['row'].state).name" size="small"
                                    :type="getStatusInfo(scope['row'].state).css">
                            </el-tag>
                        </template>
                    </el-table-column>
                </el-table>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="accountJoinGroup()">
                        <icon-svg icon-class="submit"></icon-svg>
                        {{$t('i18n.组内账号管理.确定')}}
                    </el-button>
                    <el-button size="mini" @click="cancelAccountJoinGroup()">
                        <icon-svg icon-class="cancel"></icon-svg>
                        {{$t('i18n.组内账号管理.取消')}}
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="removeAFromGroupDialog.visible" v-if="removeAFromGroupDialog.visible" class="delete-dialog"
                       width="768px" :close-on-click-modal="false" :close-on-press-escape="false">
                <div slot="title" class="delete-title">
                    <icon-svg icon-class="warning"></icon-svg>操作确认
                </div>
                <div class="warning">
                    <div>移除用户组内成员不会删除用户账号！</div>
                </div>
                <div class="mar-top">
                    您确定要"移除"选中的 <span class="text-bold">{{removeAFromGroupDialog.idList.length}}个</span> 成员账号？<br/>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="removeAccount">确定</el-button>
                    <el-button size="mini" @click="removeAFromGroupDialog.visible = false">取消</el-button>
                </div>
            </el-dialog>
        </div>
        <fix-tool-bar ref="toolbar"></fix-tool-bar>
    </div>
</template>

<script>
    import {asyncGet} from '@src/assets/axios'
    import {api} from "@src/assets/api";
    import FixToolBar from  "@src/components/fix-tool-bar"

    export default {
        name: "account-group-details",
        components: {FixToolBar},
        data() {
            return{
                filter: {
                    pageNation: this.common.initPageNation(),
                    searchValue: '',
                    sort: {
                        name: '',
                        order: '',
                    }
                },
                groupInfo: {
                    id: this.$route.query['id'],
                    name: this.$route.query['name']
                },
                selectedIdList: [],
                accountList: [],
                accountStatusList: this.common.statusList,
                protocolTypeList: this.common.protocolTypeList,
                authTypeList: this.common.authTypeList,
                joinGroupVisible: false,
                joinGroupDialog: {},
                removeAFromGroupDialog: {
                    visible: false
                }
            }
        },
        methods: {
            initPageInfo() {
                this.getAccountList();
            },
            updateFilter(column) {
                this.filter.sort = {
                    name: column.prop,
                    order: column.order
                };
                this.getAccountList();
            },
            getAccountList() {
                let params = {
                    group_id: this.groupInfo.id,
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
                asyncGet(api.getAccountGroupDetails, params)
                    .then((response) => {
                        let res = response && response.rows ? response.rows : {};

                        this.accountList = res && res.data ? res.data : [];
                        this.filter.pageNation.totalItem = res && res.count ? res.count : 0;
                        this.selectedIdList = [];
                    }, (error) => {
                        this.common.notification('warning', error.msg);
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
                    selectedIdList.push(selectedItemObj.id);
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
            },
            getStatusInfo(statusId) {
                let statusInfo = {
                    name: '',
                    css: ''
                };

                if (statusId) {
                    for (let statusObj of this.accountStatusList) {
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
            // account join group start
            initAccountJoinGroup() {
                this.joinGroupVisible = true;
                this.joinGroupDialog = {
                    filter: {
                        pageNation: this.common.initPageNation(),
                        searchValue: '',
                        sort: {
                            name: '',
                            order: '',
                        }
                    },
                    selectedIdList: [],
                    accountList: []
                };
                this.getCanJoinGroupAccountList();
            },
            getCanJoinGroupAccountList() {
                let filterObj = this.joinGroupDialog.filter;
                let params = {
                    group_id: this.groupInfo.id,
                    pageNo: filterObj.pageNation.pageNo,
                    pageSize: filterObj.pageNation.pageSize
                };

                !!filterObj.searchValue ? params.search = filterObj.searchValue : '';
                if (!!filterObj.sort.order) {
                    params.sort = {
                        name: filterObj.sort.name,
                        order: filterObj.sort.order
                    };
                }
                asyncGet(api.getAccountGroupDetails, params)
                    .then((response) => {
                        let res = response && response.rows ? response.rows : {};

                        this.joinGroupDialog.accountList = res && res.data ? res.data : [];
                        filterObj.pageNation.totalItem = res && res.count ? res.count : 0;
                        this.joinGroupDialog.selectedIdList = [];
                    }, (error) => {
                        this.common.notification('warning', error.msg);
                    })
            },
            updateJoinGroupSelected(selectedItemList) {
                let selectedIdList = [];

                selectedItemList.forEach(function (selectedItemObj) {
                    selectedIdList.push(selectedItemObj.id);
                });
                this.joinGroupDialog.selectedIdList = selectedIdList;
            },
            updateJoinGroupFilter(column) {
                this.filter.sort = {
                    name: column.prop,
                    order: column.order
                };
                this.getCanJoinGroupAccountList();
            },
            accountJoinGroup() {
                if (this.joinGroupDialog.selectedIdList.length > 0) {
                    // call API
                    this.common.notification('success', this.$t('i18n.组内账号管理.添加组成员账号成功'));
                    this.joinGroupVisible = false;
                    this.filter.pageNation.pageNo = 1;
                    this.getAccountList();
                }else {
                    this.common.notification('warning', this.$t('i18n.组内账号管理.请选择需要加入组的账号'));
                }
            },
            cancelAccountJoinGroup() {
                this.joinGroupVisible = false;
            },
            // account join group end

            // remove account start
            initRemoveAFromGroup(idList) {
                this.removeAFromGroupDialog = {
                    visible: true,
                    idList: idList
                };
            },
            removeAccount() {
                //call API
                this.removeAFromGroupDialog.visible = false;
                this.filter.pageNation.pageNo = 1;
                this.getAccountList();
                this.common.notification('success', this.$t('i18n.组内账号管理.移除组内账号成功'));
            }
            // remove account end
        },
        created() {
            this.initPageInfo();
        },
        mounted() {
            this.$refs.toolbar.fixToolBarInit(130);
        },
        beforeDestroy() {
            this.$refs.toolbar.removeFixToolBar();
        }
    }
</script>

<style lang="scss" scoped>
    #accountGroupDetail{
        table{
            svg{
                padding-right: 5px;
            }
        }
    }
</style>
