<template>
    <div id="hostGroupDetails">
        <div id="pageTitle">
            <el-breadcrumb class="page-title mar-btm" separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>{{groupInfo.name}}</el-breadcrumb-item>
            </el-breadcrumb>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>{{$t('i18n.导航页面.资产')}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/modules-main/asset/host-group'}">
                    {{$t('i18n.导航页面.主机分组管理')}}
                </el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('i18n.组内服务器管理.组内服务器管理')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{groupInfo.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div id="pageContent">
            <el-row :gutter="20" class="tool-bar">
                <el-col :span="18">
                    <el-button size="mini" type="primary" @click="initHostJoinGroup()">
                        <i class="el-icon-circle-plus-outline"></i>
                        {{$t('i18n.组内服务器管理.添加组成员')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="confirmRemoveHost(selectedIdList)">
                        {{$t('i18n.组内服务器管理.移除组成员')}}
                    </el-button>
                    <el-button size="mini" type="primary" @click="getHostListInGroup()">
                        <i class="el-icon-refresh"></i>
                        {{$t('i18n.组内服务器管理.刷新列表')}}
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <el-input :class="{'search': true, 'searching': !!filter.searchValue}" prefix-icon="el-icon-search"
                              size="mini" :placeholder="$t('i18n.组内服务器管理.搜索：主机IP/名称/描述/资产编号')"
                              v-model="filter.searchValue" maxlength="50">
                    </el-input>
                </el-col>
            </el-row>
            <div class="mar-btm">
                <el-table :data="hostsList" border @selection-change="updateSelected" @sort-change="updateFilter">
                    <el-table-column min-width="5%" align="center" type="selection"></el-table-column>
                    <el-table-column min-width="20%" prop="name" header-align="center" sortable="custom" :label="$t('i18n.组内服务器管理.主机名称')">
                        <template slot-scope="scope">
                            <edit-input :id="scope['row'].id" :name="scope['row'].name" :desc="scope['row'].desc"
                                        :callback="updateMainframeName">
                            </edit-input>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" prop="os" align="center" sortable="custom" :label="$t('i18n.组内服务器管理.操作系统')">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" :content="getOperationSystemInfo(scope['row']['os_type']).name" placement="right">
                                <icon-svg :icon-class="getOperationSystemInfo(scope['row']['os_type']).icon"></icon-svg>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" header-align="center" prop="cid" sortable="custom" :label="$t('i18n.组内服务器管理.资产编号')">
                    </el-table-column>
                    <el-table-column min-width="15%" prop="status" align="center" sortable="custom" :label="$t('i18n.组内服务器管理.状态')">
                        <template slot-scope="scope">
                            <el-tag effect="dark" v-text="getHostsStatusInfo(scope['row'].state).name"  size="small"
                                    :type="getHostsStatusInfo(scope['row'].state).css">
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" align="center" :label="$t('i18n.组内服务器管理.操作')">
                        <template slot-scope="scope">
                            <el-link type="primary" class="mar-rgt" :underline="false" v-text="$t('i18n.组内服务器管理.移除组成员')"
                                     @click="confirmRemoveHost([scope['row'].id])">
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
            <el-dialog :title="$t('i18n.组内服务器管理.添加组成员')" :visible.sync="joinGroupVisible" width="1000px"
                       :close-on-click-modal="false" :close-on-press-escape="false" v-if="joinGroupVisible">
                <el-row :gutter="20" class="tool-bar">
                    <el-col :span="18">
                        <el-button size="mini" type="primary" @click="getCanJoinGroupHostList()">
                            <i class="el-icon-refresh"></i>
                            {{$t('i18n.组内服务器管理.刷新列表')}}
                        </el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-input :class="{'search': true, 'searching': !!joinGroupDialog.filter.searchValue}" prefix-icon="el-icon-search"
                                  size="mini" :placeholder="$t('i18n.组内服务器管理.搜索：主机IP/名称/描述/资产编号')"
                                  v-model="joinGroupDialog.filter.searchValue" maxlength="50">
                        </el-input>
                    </el-col>
                </el-row>
                <el-table :data="joinGroupDialog.hostsList" border @selection-change="updateJoinGroupSelected" @sort-change="updateJoinGroupFilter">
                    <el-table-column min-width="5%" align="center" type="selection"></el-table-column>
                    <el-table-column min-width="40%" prop="name" header-align="center" sortable="custom" :label="$t('i18n.组内服务器管理.主机名称')">
                        <template slot-scope="scope">
                            <edit-input :id="scope['row'].id" :name="scope['row'].name" :desc="scope['row'].desc"
                                        :callback="updateMainframeName">
                            </edit-input>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" prop="os" align="center" sortable="custom" :label="$t('i18n.组内服务器管理.操作系统')">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" :content="getOperationSystemInfo(scope['row']['os_type']).name" placement="right">
                                <icon-svg :icon-class="getOperationSystemInfo(scope['row']['os_type']).icon"></icon-svg>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" header-align="center" prop="cid" sortable="custom" :label="$t('i18n.组内服务器管理.资产编号')">
                    </el-table-column>
                    <el-table-column min-width="15%" prop="status" align="center" sortable="custom" :label="$t('i18n.组内服务器管理.状态')">
                        <template slot-scope="scope">
                            <el-tag effect="dark" v-text="getHostsStatusInfo(scope['row'].state).name"  size="small"
                                    :type="getHostsStatusInfo(scope['row'].state).css">
                            </el-tag>
                        </template>
                    </el-table-column>
                </el-table>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="accountJoinGroup()">
                        <icon-svg icon-class="submit"></icon-svg>
                        {{$t('i18n.组内服务器管理.确定')}}
                    </el-button>
                    <el-button size="mini" @click="cancelHostJoinGroup()">
                        <icon-svg icon-class="cancel"></icon-svg>
                        {{$t('i18n.组内服务器管理.取消')}}
                    </el-button>
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
    import EditInput from "@src/components/edit-input";

    export default {
        name: "host-group-details",
        components: {FixToolBar, EditInput},
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
                hostsList: [],
                hostsStatusList: this.common.statusList,
                osTypeList: this.common.osTypeList,
                joinGroupVisible: false,
                joinGroupDialog: {}
            }
        },
        methods: {
            initPageInfo() {
                this.getHostListInGroup();
            },
            updateFilter(column) {
                this.filter.sort = {
                    name: column.prop,
                    order: column.order
                };
                this.getHostListInGroup();
            },
            getHostListInGroup() {
                let params = {
                    pageNo: this.filter.pageNation.pageNo,
                    pageSize: this.filter.pageNation.pageSize,
                    group_id: this.groupInfo.id
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

                        this.hostsList = res && res.data ? res.data : [];
                        this.filter.pageNation.totalItem = res && res.count ? res.count : 0;
                         this.selectedIdList = [];
                    }, (error) => {
                        this.common.notification('warning', error.msg);
                    })
            },
            pageSizeChange(newPageSize) {
                this.filter.pageNation.pageSize = newPageSize;
                this.filter.pageNation.pageNo = 1;
                this.getHostListInGroup();
            },
            changeCurrentPage(newPageNo) {
                this.filter.pageNation.pageNo = newPageNo;
                this.getHostListInGroup();
            },
            updateSelected(selectedItemList) {
                let selectedIdList = [];

                selectedItemList.forEach(function (selectedItemObj) {
                    selectedIdList.push(selectedItemObj.id);
                });
                this.selectedIdList = selectedIdList;
            },
            getOperationSystemInfo(osTypeId){
                let OSInfo = {
                    name: '',
                    icon: ''
                };

                if (osTypeId) {
                    for (let osTypeObj of this.osTypeList) {
                        if (osTypeObj.id === osTypeId) {
                            OSInfo = {
                                name: osTypeObj.name,
                                icon: osTypeObj.icon
                            };
                            break;
                        }
                    }
                }
                return OSInfo;
            },
            getHostsStatusInfo(statusId) {
                let statusInfo = {
                    name: '',
                    css: ''
                };

                if (statusId) {
                    for (let hostsStatusObj of this.hostsStatusList) {
                        if (hostsStatusObj.id === statusId) {
                            statusInfo = {
                                name: hostsStatusObj.name,
                                css: hostsStatusObj.css
                            };
                            break;
                        }
                    }
                }
                return statusInfo;
            },
            updateMainframeName(id, name) {
                //call API update mainframe name
                this.common.notification('success', this.$t('i18n.组内服务器管理.更新主机名称成功'));
            },
            // host join group start
            initHostJoinGroup() {
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
                    hostsList: [],
                };
                this.getCanJoinGroupHostList();
            },
            getCanJoinGroupHostList() {
                let filterObj = this.joinGroupDialog.filter;
                let params = {
                    pageNo: filterObj.pageNation.pageNo,
                    pageSize: filterObj.pageNation.pageSize,
                    group_id: this.groupInfo.id
                };

                !!filterObj.searchValue ? params.search = filterObj.searchValue : '';
                if (!!filterObj.sort.order) {
                    params.sort = {
                        name: filterObj.sort.name,
                        order: filterObj.sort.order
                    };
                }
                asyncGet(api.getHostsList, params)
                    .then((response) => {
                        let res = response && response.rows ? response.rows : {};

                        this.joinGroupDialog.hostsList = res && res.data ? res.data : [];
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
                this.getCanJoinGroupHostList();
            },
            accountJoinGroup() {
                if (this.joinGroupDialog.selectedIdList.length > 0) {
                    // call API
                    this.common.notification('success', this.$t('i18n.组内服务器管理.添加组成员成功'));
                    this.joinGroupVisible = false;
                    this.filter.pageNation.pageNo = 1;
                    this.getHostListInGroup();
                }else {
                    this.common.notification('warning', this.$t('i18n.组内服务器管理.请选择需要加入组的主机'));
                }
            },
            cancelHostJoinGroup() {
                this.joinGroupVisible = false;
            },
            // host join group end

            // remove host from group start
            confirmRemoveHost(idList) {
                if (idList && idList[0]) {
                    this.$confirm(this.$t('i18n.组内服务器管理.确定将选中主机从组中移除'),
                        this.$t('i18n.组内服务器管理.移除组成员'), {
                        closeOnClickModal: false,
                        confirmButtonText: this.$t('i18n.组内服务器管理.确定'),
                        cancelButtonText: this.$t('i18n.组内服务器管理.取消'),
                        type: 'warning'
                    }).then(() =>{
                        this.removeHost(idList);
                    });
                }
            },
            removeHost(idList) {
                //call API
                this.filter.pageNation.pageNo = 1;
                this.getHostListInGroup();
                this.common.notification('success', this.$t('i18n.组内服务器管理.选中主机已成功从组中移除'));
            }
            // remove host from group end
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

<style scoped>

</style>
