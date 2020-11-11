<template>
    <div id="mainframe">
        <el-breadcrumb id="pageTitle" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>{{$t('i18n.导航页面.主机管理')}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="pageContent">
            <el-row :gutter="20" class="tool-bar">
                <el-col :span="18">
                    <el-button size="mini" type="primary" @click="initHostsInfoDialog()">
                        <i class="el-icon-circle-plus-outline"></i>
                        {{$t('i18n.主机管理页面.添加主机')}}
                    </el-button>
                    <el-button size="mini" type="primary" @click="initImportAssetsDialog()">
                        <i class="el-icon-circle-plus-outline"></i>
                        {{$t('i18n.主机管理页面.导入主机和账号')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="confirmDisabledHost(selectedIdList)">
                        {{$t('i18n.主机管理页面.禁用')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="confirmEnabledHost(selectedIdList)">
                        {{$t('i18n.主机管理页面.解禁')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="initDeleteHost(selectedIdList)">
                        <i class="el-icon-delete"></i>
                        {{$t('i18n.主机管理页面.删除')}}
                    </el-button>
                    <el-button size="mini" type="primary" @click="getHostList()">
                        <i class="el-icon-refresh"></i>
                        {{$t('i18n.主机管理页面.刷新列表')}}
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <el-input :class="{'search': true, 'searching': !!filter.searchValue}" prefix-icon="el-icon-search"
                              size="mini" :placeholder="$t('i18n.主机管理页面.搜索：主机IP/名称/描述/资产编号')"
                              v-model="filter.searchValue" maxlength="50">
                    </el-input>
                </el-col>
            </el-row>
            <div class="mar-btm">
                <el-table :data="tableData" border @selection-change="updateSelected" @sort-change="updateFilter"
                          @filter-change="filterChange">
                    <el-table-column min-width="5%" align="center" type="selection"></el-table-column>
                    <el-table-column min-width="15%" header-align="center" prop="name" sortable="custom" :label="$t('i18n.主机管理页面.名称')">
                        <template slot-scope="scope">
                            <edit-input :id="scope['row'].id" :name="scope['row'].name" :desc="scope['row'].desc"
                                        :callback="updateMainframeName">
                            </edit-input>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="15%" header-align="center" prop="ip" :label="$t('i18n.主机管理页面.IP地址')">
                    </el-table-column>
                    <el-table-column min-width="13%" header-align="center" prop="os" sortable="custom" :label="$t('i18n.主机管理页面.操作系统')">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" :content="getOperationSystemInfo(scope['row']['os_type']).name" placement="right">
                                <icon-svg :icon-class="getOperationSystemInfo(scope['row']['os_type']).icon"></icon-svg>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="12%" header-align="center" prop="cid" sortable="custom"
                                     :label="$t('i18n.主机管理页面.资产编号')">
                    </el-table-column>
                    <el-table-column min-width="10%" header-align="center" :label="$t('i18n.主机管理页面.账号数')">
                        <template slot-scope="scope">
                            <el-link type="primary" :underline="false" v-text="scope['row']['acc_count']"
                                     @click="MRemoteAccount(scope['row']['id'], scope['row'].name)">
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="10%" prop="status" sortable="custom" :label="getStatusTitle()" align="center"
                                     column-key="status" :filters="statusFilterList" :filter-multiple="false">
                        <template slot-scope="scope">
                            <el-tag effect="dark" v-text="getHostsStatusInfo(scope['row'].state).name"  size="small"
                                    :type="getHostsStatusInfo(scope['row'].state).css">
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" align="center" :label="$t('i18n.主机管理页面.操作')">
                        <template slot-scope="scope">
                            <el-link type="primary" class="mar-rgt" :underline="false" v-text="$t('i18n.主机管理页面.禁用')"
                                     :disabled="!canDisabledHost(scope['row'].state)" @click="confirmDisabledHost([scope['row'].id])">
                            </el-link>
                            <el-link type="primary" class="mar-rgt" :underline="false" v-text="$t('i18n.主机管理页面.解禁')"
                                     :disabled="!canEnabledHost(scope['row'].state)" @click="confirmEnabledHost([scope['row'].id])">
                            </el-link>
                            <el-dropdown trigger="click">
                                <span>
                                    {{$t('i18n.主机管理页面.更多操作')}}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown" class="operation">
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" v-text="$t('i18n.主机管理页面.编辑详情')"
                                                 @click="initHostsInfoDialog(scope['row'])">
                                        </el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" v-text="$t('i18n.主机管理页面.管理远程账号')"
                                                 @click="MRemoteAccount(scope['row']['id'], scope['row'].name)">
                                        </el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false"
                                                 v-text="$t('i18n.主机管理页面.复制主机')">
                                        </el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" v-text="$t('i18n.主机管理页面.删除')"
                                                 @click="initDeleteHost([scope['row'].id])">
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
                    <el-col :span="12">
                        <div class="notice">
                            <label class="title box-block" v-text="$t('i18n.主机管理页面.温馨提示：')"></label>
                            <div class="content">
                                <div>
                                    1.{{$t('i18n.主机管理页面.批量导入主机和账号需要上传csv格式的文件，您可以下载')}}
                                    <a href="../../../../file/teleport-example-asset.csv"
                                       download="teleport-example-asset.csv">
                                        {{$t('i18n.主机管理页面.资产信息文件模板')}}
                                    </a>
                                    {{$t('i18n.主机管理页面.进行编辑。')}}
                                </div>
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
            <el-dialog :title="hostsInfoDialog.title" :visible.sync="hostsInfoDialogVisible" width="768px"
                       :close-on-click-modal="false" :close-on-press-escape="false" v-if="hostsInfoDialogVisible">
                <el-form :model="hostsInfoDialog" status-icon :rules="hostsInfoDialog.rules" ref="hostsInfoDialog"
                         size="medium">
                    <el-form-item prop="systemInfo.name" label="远程主机系统:" label-width="120px">
                        <el-dropdown trigger="click" @command="updateSystem" size="mini" placement="bottom-start">
                            <el-button size="mini">
                                <icon-svg v-if="hostsInfoDialog.systemInfo && hostsInfoDialog.systemInfo.icon"
                                          :icon-class="hostsInfoDialog.systemInfo.icon">
                                </icon-svg>
                                {{hostsInfoDialog.systemInfo && hostsInfoDialog.systemInfo.name ?
                                hostsInfoDialog.systemInfo.name : $t('i18n.主机管理页面.请选择远程主机系统')}}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu solt="dropdown">
                                <el-dropdown-item v-for="systemObj in hostsInfoDialog.systemList" :command="systemObj"
                                                  v-bind:key="systemObj.id">
                                    <icon-svg :icon-class="systemObj.icon"></icon-svg>
                                    {{systemObj.name}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item prop="RemoteHostAddress" label="远程主机地址:" label-width="120px">
                                <el-input v-model="hostsInfoDialog.RemoteHostAddress" :placeholder="$t('i18n.主机管理页面.请输入远程主机IP地址')"
                                          size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item prop="connectedModal.name" label="连接模式:" label-width="120px">
                        <el-dropdown trigger="click" @command="updateConnectedModal" size="mini" placement="bottom-start">
                            <el-button size="mini" class="mar-rgt">
                                {{hostsInfoDialog.connectedModal && hostsInfoDialog.connectedModal.name ?
                                hostsInfoDialog.connectedModal.name : $t('i18n.主机管理页面.请选择连接模式')}}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-popover trigger="hover" placement="right">
                                <div class="mar-btm">
                                    <label class="text-semibold" v-text="$t('i18n.主机管理页面.直接连接')"></label>
                                    <div v-text="$t('i18n.主机管理页面.远程主机可以由teleport直接连通')"></div>
                                    <div>
                                        <label v-text="$t('i18n.主机管理页面.操作端')"></label>
                                        <icon-svg icon-class="rightarrow"></icon-svg>
                                        <label v-text="$t('i18n.主机管理页面.teleport')"></label>
                                        <icon-svg icon-class="rightarrow"></icon-svg>
                                        <label v-text="$t('i18n.主机管理页面.远程主机')"></label>
                                    </div>
                                </div>
                               <div>
                                    <label class="text-semibold" v-text="$t('i18n.主机管理页面.端口映射')"></label>
                                    <div v-text="$t('i18n.主机管理页面.teleport需要通过一台路由主机以端口映射的方式访问远程主机')">
                                    </div>
                                    <div>
                                        <label v-text="$t('i18n.主机管理页面.操作端')"></label>
                                        <icon-svg icon-class="rightarrow"></icon-svg>
                                        <label v-text="$t('i18n.主机管理页面.teleport')"></label>
                                        <icon-svg icon-class="rightarrow"></icon-svg>
                                        <label v-text="$t('i18n.主机管理页面.路由主机')"></label>
                                        <icon-svg icon-class="rightarrow"></icon-svg>
                                        <label v-text="$t('i18n.主机管理页面.远程主机')"></label>
                                    </div>
                                </div>
                                <i class="el-icon-question" slot="reference"></i>
                            </el-popover>
                            <el-dropdown-menu solt="dropdown">
                                <el-dropdown-item v-for="connectedModalObj in hostsInfoDialog.connectedModalList"
                                                  :command="connectedModalObj" v-bind:key="connectedModalObj.id"
                                                  v-text="connectedModalObj.name">
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                    <el-row v-if="hostsInfoDialog.connectedModal.id === hostsInfoDialog.connectedModalList[1].id">
                        <el-col :span="10">
                            <el-form-item prop="RoutingHost.Address" label="路由主机地址:"
                                          label-width="120px">
                                <el-input v-model="hostsInfoDialog.RoutingHost.Address" size="mini"
                                          :placeholder="$t('i18n.主机管理页面.请输入路由主机IP地址')">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="RoutingHost.port" label="映射端口:"
                                          label-width="100px">
                                <el-input v-model="hostsInfoDialog.RoutingHost.port" size="mini"
                                          :placeholder="$t('i18n.主机管理页面.请输入映射端口')">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="13">
                            <el-form-item label="名称:" label-width="120px">
                                <el-input v-model="hostsInfoDialog.name" :placeholder="$t('i18n.主机管理页面.请输入名称')" size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="13">
                            <el-form-item label="资产编号:" label-width="120px">
                                <el-input v-model="hostsInfoDialog.assetNumber" size="mini"
                                          :placeholder="$t('i18n.主机管理页面.请输入资产编号')">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="备注:" label-width="120px">
                                <el-input type="textarea" :rows="3" v-model="hostsInfoDialog.remark" size="mini"
                                          :placeholder="$t('i18n.主机管理页面.请输入备注')">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitHostsInfo()" size="mini">
                        <icon-svg icon-class="submit"></icon-svg>
                        {{$t('i18n.主机管理页面.确定')}}
                    </el-button>
                    <el-button @click="cancelAddHosts()" size="mini">
                        <icon-svg icon-class="cancel"></icon-svg>
                        {{$t('i18n.主机管理页面.取消')}}
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog :title="$t('i18n.主机管理页面.导入资产（主机及账号）')" :visible.sync="importADialogVisible"
                       width="768px" :close-on-click-modal="false" :close-on-press-escape="false"
                       v-if="importADialogVisible">
                <el-upload ref="upload" drag :action="importAssetsDialog.uploadUrl" accept=".csv" :limit="importAssetsDialog.limit"
                           :on-exceed="uploadFileOutOfRange" :before-upload="beforeUploadFile" :auto-upload="false">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
                <div class="notice mar-top">
                    <label class="title box-block" v-text="$t('i18n.主机管理页面.温馨提示：')"></label>
                    <div class="content">
                        <span>
                            {{$t('i18n.主机管理页面.批量导入主机和账号需要上传csv格式的文件，您可以下载')}}
                            <a href="../../../../file/teleport-example-asset.csv"
                               download="teleport-example-asset.csv">
                                {{$t('i18n.主机管理页面.资产信息文件模板')}}
                            </a>
                            {{$t('i18n.主机管理页面.进行编辑。')}}
                        </span>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="importAssets">{{$t('i18n.主机管理页面.确定')}}</el-button>
                    <el-button size="mini" @click="importADialogVisible = false">{{$t('i18n.主机管理页面.取消')}}</el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="deleteAccountDialog.visible" v-if="deleteAccountDialog.visible" class="delete-dialog"
                       width="768px" :close-on-click-modal="false" :close-on-press-escape="false">
                <div slot="title" class="delete-title">
                    <icon-svg icon-class="warning"></icon-svg>操作确认
                </div>
                <div class="warning">
                    <div class="text-bold">注意：删除操作不可恢复！！</div>
                    <div>删除主机将同时删除与之相关的账号，并将主机和账号从所在分组中移除，同时删除所有相关授权！</div>
                </div>
                <div class="mar-top">
                    您确定要"删除"选中的 <span class="text-bold">{{deleteAccountDialog.idList.length}}个</span> 主机？<br/>
                    如果您希望临时禁止登录指定主机，可将其状态设置为“禁用”。
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="deleteHost">确定</el-button>
                    <el-button size="mini" @click="deleteAccountDialog.visible = false">取消</el-button>
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
        name: 'mainframe',
        components: {EditInput, FixToolBar},
        data() {
            return {
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
                tableData: [],
                hostsStatusList: this.common.statusList,
                statusFilterList: this.common.statusFilterList,
                osTypeList: this.common.osTypeList,
                hostsInfoDialogVisible: false,
                hostsInfoDialog: {},
                importADialogVisible: false,
                importAssetsDialog: {},
                deleteAccountDialog: {
                    visible: false
                }
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
                this.getHostList();
            },
            filterChange(filterObj) {
                const newStatusFilter = filterObj.status[0];

                if (this.filter.status !== newStatusFilter) {
                    this.filter.status = newStatusFilter;
                    this.getHostList();
                }
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
                !!this.filter.status ? params.stauts = this.filter.status : '';
                asyncGet(api.getHostsList, params)
                    .then((response) => {
                        let res = response && response.rows ? response.rows : {};

                        this.tableData = res && res.data ? res.data : [];
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
                this.getHostList();
            },
            changeCurrentPage(newPageNo) {
                this.filter.pageNation.pageNo = newPageNo;
                this.getHostList();
            },
            getStatusTitle() {
                let statusFilter = this.$t('i18n.主机管理页面.全部');

                for (let statusFilterObj of this.statusFilterList) {
                    if (statusFilterObj.value === this.filter.status) {
                        statusFilter = statusFilterObj.text;
                        break;
                    }
                }
                return `${this.$t('i18n.主机管理页面.状态')}(${statusFilter})`;
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
            updateMainframeName(id, name) {
                //call API update mainframe name
                this.common.notification('success', this.$t('i18n.主机管理页面.更新主机名称成功'));
            },
            MRemoteAccount(id, name) {
                this.$router.push({
                    path: '/modules-main/asset/mainframe-account',
                    query: {
                        id: id,
                        name: name
                    }
                })
            },
            // create & update host start
            initHostsInfoDialog(hostsInfo) {
                this.hostsInfoDialogVisible = true;
                this.hostsInfoDialog = {
                    isCreate: !hostsInfo,
                    title: !hostsInfo ? this.$t('i18n.主机管理页面.添加主机') : `编辑主机详情: ${hostsInfo.name}`,
                    systemInfo: {
                        id: 0,
                        name: '',
                        icon: ''
                    },
                    RemoteHostAddress: !!hostsInfo ? hostsInfo.ip : '',
                    connectedModal: {
                        id: '',
                        name: '',
                    },
                    RoutingHost: {
                        Address: !!hostsInfo ? hostsInfo.router_ip : '',
                        port: !!hostsInfo ? hostsInfo.router_port : ''
                    },
                    name: !!hostsInfo ? hostsInfo.name : '',
                    assetNumber: !!hostsInfo ? hostsInfo.cid : '',
                    remark: !!hostsInfo ? hostsInfo.desc : '',
                    systemList: this.common.osTypeList,
                    connectedModalList: this.common.connectedModalList,
                    rules: {
                        'systemInfo.name': [{
                            required: true, message: this.$t('i18n.主机管理页面.请选择远程主机系统'), trigger: 'blur'
                        }],
                        RemoteHostAddress: [{
                            required: true, message: this.$t('i18n.主机管理页面.请输入远程主机IP地址'), trigger: 'blur'
                        }],
                        'connectedModal.name': [{
                            required: true, message: this.$t('i18n.主机管理页面.请选择连接模式'), trigger: 'blur'
                        }],
                        'RoutingHost.Address': [{
                            required: true, message: this.$t('i18n.主机管理页面.请输入路由主机IP地址'), trigger: 'blur'
                        }],
                        'RoutingHost.port': [{
                            required: true, message: this.$t('i18n.主机管理页面.请输入映射端口'), trigger: 'blur'
                        }]
                    }
                };
                if (!hostsInfo) {
                    //init connect modal
                    this.updateConnectedModal(this.hostsInfoDialog.connectedModalList[0]);
                }else {
                    // init system info
                    for (let osTypeObj of this.hostsInfoDialog.systemList){
                        if (osTypeObj.id === hostsInfo['os_type']) {
                            this.updateSystem(osTypeObj);
                            break;
                        }
                    }
                    // init connected modal
                    for (let connectedModalObj of this.hostsInfoDialog.connectedModalList){
                        if (connectedModalObj.id === hostsInfo.type) {
                            this.updateConnectedModal(connectedModalObj);
                            break;
                        }
                    }
                }
            },
            updateSystem(newSystemObj) {
                this.hostsInfoDialog.systemInfo = {
                    id: newSystemObj.id,
                    name: newSystemObj.name,
                    icon: newSystemObj.icon
                };
            },
            updateConnectedModal(newConnectedModal) {
                this.hostsInfoDialog.connectedModal = {
                    id: newConnectedModal.id,
                    name: newConnectedModal.name,
                };
            },
            cancelAddHosts() {
                this.$refs['hostsInfoDialog'].resetFields();
                this.hostsInfoDialogVisible = false;
            },
            submitHostsInfo() {
                this.$refs['hostsInfoDialog'].validate((passValidate) => {
                    if (passValidate) {
                        this.hostsInfoDialog.isCreate ? this.AddHosts() : this.updateHostsInfo();
                    }else {
                        return false;
                    }
                })
            },
            AddHosts() {
                // call API
                this.common.notification('success', this.$t('i18n.主机管理页面.添加主机成功'));
                this.hostsInfoDialogVisible = false;
            },
            updateHostsInfo() {
                // call API
                this.common.notification('success', this.$t('i18n.主机管理页面.更新主机信息成功'));
                this.hostsInfoDialogVisible = false;
            },
            // create & update host end

            // import assets start
            initImportAssetsDialog() {
                this.importADialogVisible = true;
                this.importAssetsDialog = {
                    uploadUrl: this.common.uploadUrl,
                    limit: 1,
                    fileList: []
                };
            },
            uploadFileOutOfRange() {
                this.common.notification('warning', this.$t('i18n.主机管理页面.单次只能导入一个资产文件'));
            },
            beforeUploadFile(file) {
                const fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
                const isCSV = fileType === 'csv';

                if (!isCSV) {
                    this.common.notification('warning', this.$t('i18n.主机管理页面.资产文件必须为csv格式'));
                }
                return isCSV;
            },
            importAssets() {
                this.$refs.upload.submit();
                this.importADialogVisible = false;
            },
            // import assets end

            // disabled host start
            canDisabledHost(status) {
                return status && status === this.hostsStatusList[0].id;
            },
            confirmDisabledHost(idList) {
                if (idList && idList[0]) {
                    this.$confirm(`确认"禁用"选中的 <span class="text-bold">${idList.length}台</span> 远程主机`,
                        this.$t('i18n.主机管理页面.禁用'), {
                        dangerouslyUseHTMLString: true,
                        closeOnClickModal: false,
                        confirmButtonText: this.$t('i18n.主机管理页面.确定'),
                        cancelButtonText: this.$t('i18n.主机管理页面.取消'),
                        cancelButtonClass: 'btn-cancel',
                        type: 'warning'
                    }).then(() =>{
                        this.disabledHost(idList);
                    });
                }
            },
            disabledHost(idList) {
                //call API
                this.getHostList();
                this.common.notification('success', this.$t('i18n.主机管理页面.禁用远程主机成功'));
            },
            // disabled host end

            // enabled host start
            canEnabledHost(status) {
                return status && status === this.hostsStatusList[1].id;
            },
            confirmEnabledHost(idList) {
                if (idList && idList[0]) {
                    this.$confirm(`确认"解禁"选中的 <span class="text-bold">${idList.length}台</span> 远程主机`,
                        this.$t('i18n.主机管理页面.禁用'), {
                        dangerouslyUseHTMLString: true,
                        closeOnClickModal: false,
                        confirmButtonText: this.$t('i18n.主机管理页面.确定'),
                        cancelButtonText: this.$t('i18n.主机管理页面.取消'),
                        cancelButtonClass: 'btn-cancel',
                        type: 'warning'
                    }).then(() =>{
                        this.enabledHost(idList);
                    });
                }
            },
            enabledHost(idList) {
                //call API
                this.getHostList();
                this.common.notification('success', this.$t('i18n.主机管理页面.解禁远程主机成功'));
            },
            // enabled host end

            // delete host start
            initDeleteHost(idList) {
                this.deleteAccountDialog = {
                    visible: true,
                    idList: idList
                };
            },
            deleteHost() {
                //call API
                this.deleteAccountDialog.visible = false;
                this.filter.pageNation.pageNo = 1;
                this.getHostList();
                this.common.notification('success', this.$t('i18n.主机管理页面.删除远程主机成功'));
            },
            // delete host end
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
    };
</script>

<style lang="scss" scoped>

</style>
