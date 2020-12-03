<template>
    <div id="hostGroup">
        <el-breadcrumb id="pageTitle" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>{{$t('i18n.导航页面.主机分组管理')}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="pageContent">
            <el-row :gutter="20" class="tool-bar">
                <el-col :span="18">
                    <el-button size="mini" type="primary" @click="initHostGroupDialog()">
                        <i class="el-icon-circle-plus-outline"></i>
                        {{$t('i18n.主机分组管理.创建主机分组')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="confirmDisabledGroup(selectedIdList)">
                        {{$t('i18n.主机分组管理.禁用')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="confirmEnabledGroup(selectedIdList)">
                        {{$t('i18n.主机分组管理.解禁')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="initDeleteHostGroup(selectedIdList)">
                        <i class="el-icon-delete"></i>
                        {{$t('i18n.主机分组管理.删除')}}
                    </el-button>
                    <el-button size="mini" type="primary" @click="getHostGroupList()">
                        <i class="el-icon-refresh"></i>
                        {{$t('i18n.主机分组管理.刷新列表')}}
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <el-input :class="{'search': true, 'searching': !!filter.searchValue}" prefix-icon="el-icon-search"
                              size="mini" :placeholder="$t('i18n.主机分组管理.搜索：账号组名称/描述')"
                              v-model="filter.searchValue" maxlength="50">
                    </el-input>
                </el-col>
            </el-row>
            <div class="mar-btm">
                <el-table :data="hostGroupList" border @selection-change="updateSelected" @sort-change="updateFilter"
                          @filter-change="filterChange">
                    <el-table-column min-width="5%" align="center" type="selection"></el-table-column>
                    <el-table-column min-width="20%" prop="name" header-align="center" sortable="custom" :label="$t('i18n.主机分组管理.名称')">
                        <template slot-scope="scope">
                            <edit-input :id="scope['row'].id" :name="scope['row'].name" :desc="scope['row'].desc"
                                        :callback="updateGroupName">
                            </edit-input>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="10%" header-align="center" :label="$t('i18n.主机分组管理.主机数')">
                        <template slot-scope="scope">
                            <el-link type="primary" :underline="false" v-text="scope['row']['host_count']"
                                     @click="hostGroupDetail(scope['row']['id'])">
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="35%" header-align="center" :label="$t('i18n.主机分组管理.主机名称')">
                        <template slot-scope="scope">
                            <el-tag size="small" type="info" v-for="hostObj in scope['row'].hostList" :command="hostObj.id" class="host-info"
                                    :key="hostObj.id">
                                <el-tooltip effect="dark" :content="getOperationSystemInfo(hostObj['os_type']).name" placement="left">
                                    <icon-svg :icon-class="getOperationSystemInfo(hostObj['os_type']).icon"></icon-svg>
                                </el-tooltip>
                                {{hostObj.name}}({{hostObj.ip}})
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" min-width="10%" align="center" sortable="custom" :label="getStatusTitle()"
                                     column-key="status" :filters="statusFilterList" :filter-multiple="false">
                        <template slot-scope="scope">
                            <el-tag effect="dark" v-text="getGroupStatusInfo(scope['row'].state).name"  size="small"
                                    :type="getGroupStatusInfo(scope['row'].state).css">
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" align="center" :label="$t('i18n.主机分组管理.操作')">
                        <template slot-scope="scope">
                            <el-link type="primary" class="mar-rgt" :underline="false" v-text="$t('i18n.主机分组管理.禁用')"
                                     :disabled="!canDisabledGroup(scope['row'].state)" @click="confirmDisabledGroup([scope['row'].id])">
                            </el-link>
                            <el-link type="primary" class="mar-rgt" :underline="false" v-text="$t('i18n.主机分组管理.解禁')"
                                     :disabled="!canEnabledHost(scope['row'].state)" @click="confirmEnabledGroup([scope['row'].id])">
                            </el-link>
                            <el-dropdown trigger="click">
                                <span>
                                    {{$t('i18n.主机分组管理.更多操作')}}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown" class="operation">
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" v-text="$t('i18n.主机分组管理.修改名称')"
                                                 @click="initHostGroupDialog(scope['row'])">
                                        </el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" v-text="$t('i18n.主机分组管理.编辑详情')"
                                                 @click="hostGroupDetail(scope['row'].id)">
                                        </el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" v-text="$t('i18n.主机分组管理.删除')"
                                                 @click="initDeleteHostGroup([scope['row'].id])">
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
            <el-dialog :title="hostGroupDialog.title" :visible.sync="hostGroupDialogVisible" width="768px"
                       :close-on-click-modal="false" :close-on-press-escape="false" v-if="hostGroupDialogVisible">
                <el-form :model="hostGroupDialog" status-icon :rules="hostGroupDialog.rules" ref="hostGroupDialog"
                         size="medium">
                    <el-row>
                        <el-col :span="10">
                            <el-form-item prop="name" label="名称:" label-width="120px">
                                <el-input v-model="hostGroupDialog.name" :placeholder="$t('i18n.主机分组管理.请输入主机分组名称')" size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="简要描述:" label-width="120px">
                                <el-input type="textarea" :rows="3" v-model="hostGroupDialog.desc" size="mini"
                                          :placeholder="$t('i18n.主机分组管理.请输入主机分组描述')">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="submitHostGroupInfo()">
                        <icon-svg icon-class="submit"></icon-svg>
                        {{$t('i18n.主机分组管理.确定')}}
                    </el-button>
                    <el-button size="mini" @click="cancelHostGroupDialog()">
                        <icon-svg icon-class="cancel"></icon-svg>
                        {{$t('i18n.主机分组管理.取消')}}
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="deleteHostGroupDialog.visible" v-if="deleteHostGroupDialog.visible" class="delete-dialog"
                       width="768px" :close-on-click-modal="false" :close-on-press-escape="false">
                <div slot="title" class="delete-title">
                    <icon-svg icon-class="warning"></icon-svg>操作确认
                </div>
                <div class="warning">
                    <div class="text-bold">注意：删除操作不可恢复！！</div>
                    <ul>
                        <li>删除分组将同时删除所有分配给此分组成员的授权！</li>
                        <li>删除分组不会删除组内的成员主机！</li>
                    </ul>
                </div>
                <div class="mar-top">
                    您确定要"删除"选中的 <span class="text-bold">{{deleteHostGroupDialog.idList.length}}个</span> 主机分组？<br/>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="deleteHostGroup">确定</el-button>
                    <el-button size="mini" @click="deleteHostGroupDialog.visible = false">取消</el-button>
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
        name: "host-group",
        components: {FixToolBar, EditInput},
        data() {
            return{
                filter: {
                    pageNation: this.common.initPageNation(),
                    searchValue: '',
                    sort: {
                        name: '',
                        order: '',
                    },
                    status: ''
                },
                selectedIdList: [],
                hostGroupList: [],
                hostsStatusList: this.common.statusList,
                statusFilterList: this.common.statusFilterList,
                osTypeList: this.common.osTypeList,
                hostGroupDialogVisible: false,
                hostGroupDialog: {},
                deleteHostGroupDialog: {
                    visible: false
                }
            }
        },
        methods: {
            initPageInfo() {
                this.getHostGroupList();
            },
            updateFilter(column) {
                this.filter.sort = {
                    name: column.prop,
                    order: column.order
                };
                this.getHostGroupList();
            },
            filterChange(filterObj) {
                const newStatusFilter = filterObj.status[0];

                if (this.filter.status !== newStatusFilter) {
                    this.filter.status = newStatusFilter;
                    this.getHostGroupList();
                }
            },
            getHostGroupList() {
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
                !!this.filter.status ? params.stauts = this.filter.status : '';
                asyncGet(api.getHostGroupList, params)
                    .then((response) => {
                        let res = response && response.rows ? response.rows : {};

                        this.hostGroupList = res && res.data ? res.data : [];
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
                this.getHostGroupList();
            },
            changeCurrentPage(newPageNo) {
                this.filter.pageNation.pageNo = newPageNo;
                this.getHostList();
            },
            getStatusTitle() {
                let statusFilter = this.$t('i18n.主机分组管理.全部');

                for (let statusFilterObj of this.statusFilterList) {
                    if (statusFilterObj.value === this.filter.status) {
                        statusFilter = statusFilterObj.text;
                        break;
                    }
                }
                return `${this.$t('i18n.主机分组管理.状态')}(${statusFilter})`;
            },
            updateGroupName(id, name) {
                //call API update group name
                this.common.notification('success', "更新主机分组名称成功");
            },
            getGroupStatusInfo(statusId) {
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
            hostGroupDetail(id) {
                this.$router.push({
                    path: '/modules-main/asset/host-group-details',
                    query: {
                        id: id
                    }
                })
            },
            // host group start
            initHostGroupDialog(hostGroupInfo) {
                this.hostGroupDialogVisible = true;
                this.hostGroupDialog = {
                    isCreate: !hostGroupInfo,
                    title: !!hostGroupInfo ? `编辑主机分组详情: ${hostGroupInfo.name}` : this.$t('i18n.主机分组管理.创建主机分组'),
                    name: !!hostGroupInfo ? hostGroupInfo.name : '',
                    desc: !!hostGroupInfo ? hostGroupInfo.desc : '',
                    rules: {
                        name: [{
                            required: true, message: this.$t('i18n.主机分组管理.请输入主机分组名称'), trigger: 'blur'
                        }]
                    }
                };
            },
            submitHostGroupInfo() {
                this.$refs['hostGroupDialog'].validate((passValidate) => {
                    if (passValidate) {
                        this.hostGroupDialog.isCreate ? this.createHostGroup() : this.updateHostGroup();
                    }else {
                        return false;
                    }
                })
            },
            createHostGroup() {
                // call API
                this.common.notification('success', this.$t('i18n.主机分组管理.创建主机分组成功'));
                this.hostGroupDialogVisible = false;
            },
            updateHostGroup() {
                // call API
                this.common.notification('success', this.$t('i18n.主机分组管理.更新主机分组成功'));
                this.hostGroupDialogVisible = false;
            },
            cancelHostGroupDialog() {
                this.$refs['hostGroupDialog'].resetFields();
                this.hostGroupDialogVisible = false;
            },
            // host group end

            // disabled host group start
            canDisabledGroup(status) {
                return status && status === this.hostsStatusList[0].id;
            },
            confirmDisabledGroup(idList) {
                if (idList && idList[0]) {
                    this.$confirm(`确认"禁用"选中的 <span class="text-bold">${idList.length}个</span> 主机分组`,
                        '禁用', {
                        dangerouslyUseHTMLString: true,
                        closeOnClickModal: false,
                        confirmButtonText: this.$t('i18n.主机分组管理.确定'),
                        cancelButtonText: this.$t('i18n.主机分组管理.取消'),
                        cancelButtonClass: 'btn-cancel',
                        type: 'warning'
                    }).then(() =>{
                        this.disabledGroup(idList);
                    });
                }
            },
            disabledGroup(idList) {
                //call API
                this.getHostGroupList();
                this.common.notification('success', this.$t('i18n.主机分组管理.禁用主机分组成功'));
            },
            // disabled host group end

            // enabled host group start
            canEnabledHost(status) {
                return status && status === this.hostsStatusList[1].id;
            },
            confirmEnabledGroup(idList) {
                if (idList && idList[0]) {
                    this.$confirm(`确认"解禁"选中的 <span class="text-bold">${idList.length}个</span> 主机分组`,
                        '解禁', {
                        dangerouslyUseHTMLString: true,
                        closeOnClickModal: false,
                        confirmButtonText: this.$t('i18n.主机分组管理.确定'),
                        cancelButtonText: this.$t('i18n.主机分组管理.取消'),
                        cancelButtonClass: 'btn-cancel',
                        type: 'warning'
                    }).then(() =>{
                        this.enabledGroup(idList);
                    });
                }
            },
            enabledGroup(idList) {
                //call API
                this.getHostGroupList();
                this.common.notification('success', this.$t('i18n.主机分组管理.解禁主机分组成功'));
            },
            // enabled host group end

            // delete host group start
            initDeleteHostGroup(idList) {
                this.deleteHostGroupDialog = {
                    visible: true,
                    idList: idList
                };
            },
            deleteHostGroup() {
                //call API
                this.deleteHostGroupDialog.visible = false;
                this.filter.pageNation.pageNo = 1;
                this.getHostGroupList();
                this.common.notification('success', this.$t('i18n.主机分组管理.删除主机分组成功'));
            }
            // delete host group end
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
    #hostGroup{
        table{
            span.host-info{
                margin-right: 4px;
                margin-bottom: 4px;
            }
        }
    }
</style>
