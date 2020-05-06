<template>
    <div id="manageRemoteAccount">
        <div id="pageTitle">
            <el-breadcrumb class="page-title mar-btm" separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>{{hostInfo.name}}</el-breadcrumb-item>
            </el-breadcrumb>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>{{$t('i18n.导航页面.资产')}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/modules-main/asset/mainframe'}">
                    {{$t('i18n.导航页面.主机管理')}}
                </el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('i18n.主机管理页面.管理远程账号')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{hostInfo.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div id="pageContent">
            <el-row :gutter="20" class="tool-bar">
                <el-col :span="18">
                    <el-button size="mini" type="primary" @click="initAccountInfo()">
                        <i class="el-icon-circle-plus-outline"></i>
                        {{$t('i18n.管理远程账号.添加账号')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="confirmDisabledAccount(selectedIdList)">
                        {{$t('i18n.管理远程账号.禁用')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="confirmEnabledAccount(selectedIdList)">
                        {{$t('i18n.管理远程账号.解禁')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="confirmDeleteAccount(selectedIdList)">
                        <i class="el-icon-delete"></i>
                        {{$t('i18n.管理远程账号.删除')}}
                    </el-button>
                    <el-button size="mini" type="primary" @click="getAccountList()">
                        <i class="el-icon-refresh"></i>
                        {{$t('i18n.管理远程账号.刷新列表')}}
                    </el-button>
                </el-col>
            </el-row>
            <div class="mar-btm">
                <el-table :data="accountList" border @selection-change="updateSelected">
                    <el-table-column align="center" type="selection"></el-table-column>
                    <el-table-column header-align="center" prop="username" :label="$t('i18n.管理远程账号.账号')">
                    </el-table-column>
                    <el-table-column align="center" class="protocol" :label="$t('i18n.管理远程账号.协议')">
                        <template slot-scope="scope">
                            <el-tag size="small" type="info">
                                <icon-svg :icon-class="getProtocolInfo(scope['row']['protocol_type']).icon">
                                </icon-svg>
                                <span v-text="getProtocolInfo(scope['row']['protocol_type']).name"></span>
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :label="$t('i18n.管理远程账号.认证方式')">
                        <template slot-scope="scope">
                            <span v-text="getAuthName(scope['row']['auth_type'])"></span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :label="$t('i18n.管理远程账号.状态')">
                        <template slot-scope="scope">
                            <el-tag effect="dark" v-text="getStatusInfo(scope['row'].state).name" size="small"
                                    :type="getStatusInfo(scope['row'].state).css">
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :label="$t('i18n.管理远程账号.操作')">
                        <template slot-scope="scope">
                            <el-link type="primary" :underline="false" v-text="$t('i18n.管理远程账号.禁用')" class="mar-rgt"
                                     :disabled="!canDisabledAccount(scope['row'].state)" @click="confirmDisabledAccount([scope['row'].id])">
                            </el-link>
                            <el-link type="primary" :underline="false" v-text="$t('i18n.管理远程账号.解禁')" class="mar-rgt"
                                     :disabled="!canEnabledAccount(scope['row'].state)" @click="confirmEnabledAccount([scope['row'].id])">
                            </el-link>
                            <el-dropdown trigger="click">
                                <span>
                                    {{$t('i18n.管理远程账号.更多操作')}}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown" class="operation">
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" v-text="$t('i18n.管理远程账号.编辑账号详情')"
                                                 @click="initAccountInfo(scope['row'])">
                                        </el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" v-text="$t('i18n.管理远程账号.删除')"
                                                 @click="confirmDeleteAccount([scope['row'].id])">
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
            <el-dialog :title="accountInfoDialog.title" :visible.sync="accountInfoDialogVisible" width="768px"
                       :close-on-click-modal="false" :close-on-press-escape="false" v-if="accountInfoDialogVisible">
                <el-form :model="accountInfoDialog" status-icon :rules="accountInfoDialog.rules" ref="accountInfoDialog"
                         size="medium">
                    <el-form-item prop="CProtocol.name" label="连接协议:" label-width="120px">
                        <el-dropdown trigger="click" @command="updateCProtocol" size="mini" placement="bottom-start">
                            <el-button size="mini">
                                <icon-svg v-if="accountInfoDialog.CProtocol && accountInfoDialog.CProtocol.icon"
                                          :icon-class="accountInfoDialog.CProtocol.icon">
                                </icon-svg>
                                {{accountInfoDialog.CProtocol && accountInfoDialog.CProtocol.name ?
                                accountInfoDialog.CProtocol.name : $t('i18n.管理远程账号.请选择连接协议')}}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu solt="dropdown">
                                <el-dropdown-item v-for="protocolTypeObj in accountInfoDialog.protocolTypeList" :command="protocolTypeObj"
                                                  v-bind:key="protocolTypeObj.id">
                                    <icon-svg :icon-class="protocolTypeObj.icon"></icon-svg>
                                    {{protocolTypeObj.name}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item prop="remotePort" label="端口:" label-width="120px">
                                <el-input v-model="accountInfoDialog.remotePort" :placeholder="$t('i18n.管理远程账号.请输入远程主机端口')"
                                          size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item prop="authMethod.name" label="认证方式:" label-width="120px">
                        <el-dropdown trigger="click" @command="updateAuthMethod" size="mini" placement="bottom-start">
                            <el-button size="mini">
                                {{accountInfoDialog.authMethod && accountInfoDialog.authMethod.name ?
                                accountInfoDialog.authMethod.name : $t('i18n.管理远程账号.请选择认证方式')}}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu solt="dropdown">
                                <el-dropdown-item v-for="authTypeObj in getAuthTypeList()" :command="authTypeObj"
                                                  v-bind:key="authTypeObj.id">
                                    {{authTypeObj.name}}
                                </el-dropdown-item>
                                <el-dropdown-item v-if="!getAuthTypeList()[0]">
                                    {{$t('i18n.管理远程账号.无可选项')}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                    <el-row v-if="accountInfoDialog.CProtocol.id === accountInfoDialog.protocolTypeList[2].id &&
                    accountInfoDialog.authMethod.id === accountInfoDialog.authTypeList[1].id">
                        <el-col :span="10">
                            <el-form-item prop="remoteUserNameNotice" label="用户名提示:" label-width="120px">
                                <el-input v-model="accountInfoDialog.remoteUserNameNotice" :placeholder="$t('i18n.管理远程账号.遇到此提示则自动发送用户名')"
                                          size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="accountInfoDialog.CProtocol.id === accountInfoDialog.protocolTypeList[2].id &&
                    accountInfoDialog.authMethod.id === accountInfoDialog.authTypeList[1].id">
                        <el-col :span="10">
                            <el-form-item prop="remotePasswordNotice" label="密码提示:" label-width="120px">
                                <el-input v-model="accountInfoDialog.remotePasswordNotice" :placeholder="$t('i18n.管理远程账号.遇到此提示则自动发送密码')"
                                          size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item prop="remoteUserName" label="远程账号:" label-width="120px">
                                <el-input v-model="accountInfoDialog.remoteUserName" :placeholder="$t('i18n.管理远程账号.请输入登陆远程主机的账号')"
                                          size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="accountInfoDialog.authMethod.id === accountInfoDialog.authTypeList[1].id">
                        <el-col :span="10">
                            <el-form-item prop="remotePassword" label="密码:" label-width="120px">
                                <el-input v-model="accountInfoDialog.remotePassword" :placeholder="$t('i18n.管理远程账号.请输入登陆远程主机的密码')"
                                          show-password size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="accountInfoDialog.authMethod.id === accountInfoDialog.authTypeList[2].id">
                        <el-col :span="20">
                            <el-form-item prop="privateKey" label="SSH私钥:" label-width="120px">
                                <el-input type="textarea" :rows="3" v-model="accountInfoDialog.privateKey" show-password size="mini"
                                          :placeholder="$t('i18n.管理远程账号.请输入登陆远程主机的私钥')">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button class="pad-hor" type="success" size="mini">
                        <icon-svg icon-class="shandian"></icon-svg>
                        {{$t('i18n.管理远程账号.测试连接')}}
                    </el-button>
                    <el-button type="primary" size="mini" @click="submitAccountInfo()">
                        <icon-svg icon-class="submit"></icon-svg>
                        {{$t('i18n.管理远程账号.确定')}}
                    </el-button>
                    <el-button size="mini" @click="cancelAccountInfoDialog()">
                        <icon-svg icon-class="cancel"></icon-svg>
                        {{$t('i18n.管理远程账号.取消')}}
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

    export default {
        name: "manage-remote-account",
        components: {FixToolBar},
        data() {
            return {
                filter: {
                    pageNation: this.common.initPageNation(),
                },
                selectedIdList: [],
                hostInfo: {
                    id: this.$route.query['id'],
                    name: this.$route.query['name']
                },
                accountList: [],
                statusList: this.common.statusList,
                protocolTypeList: this.common.protocolTypeList,
                authTypeList: this.common.authTypeList,
                accountInfoDialogVisible: false,
                accountInfoDialog: {},
            }
        },
        methods: {
            initPageInfo() {
                this.getAccountList();
            },
            getAccountList() {
                let params = {
                    host_id: this.hostInfo.id,
                    pageNo: this.filter.pageNation.pageNo,
                    pageSize: this.filter.pageNation.pageSize
                };

                asyncGet(api.getAccountList, params)
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
            getStatusInfo(statusId) {
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
            // disabled account start
            canDisabledAccount(state) {
                return state && state === this.statusList[0].id;
            },
            confirmDisabledAccount(idList) {
                if (idList && idList[0]) {
                    this.$confirm('确认<span class="text-bold">"禁用"</span>选中远程主机账号', this.$t('i18n.管理远程账号.禁用'), {
                        dangerouslyUseHTMLString: true,
                        closeOnClickModal: false,
                        confirmButtonText: this.$t('i18n.管理远程账号.确定'),
                        cancelButtonText: this.$t('i18n.管理远程账号.取消'),
                        type: 'warning'
                    }).then(() =>{
                        this.disabledAccount(idList);
                    });
                }
            },
            disabledAccount(idList) {
                //call API
                this.getAccountList();
                this.common.notification('success', this.$t('i18n.管理远程账号.禁用远程主机账号成功'));
            },
            // disabled account end

            // enabled account start
            canEnabledAccount(state) {
                return state && state === this.statusList[1].id;
            },
            confirmEnabledAccount(idList) {
                if (idList && idList[0]) {
                    this.$confirm('确认<span class="text-bold">"解禁"</span>选中远程主机账号', this.$t('i18n.管理远程账号.解禁'), {
                        dangerouslyUseHTMLString: true,
                        closeOnClickModal: false,
                        confirmButtonText: this.$t('i18n.管理远程账号.确定'),
                        cancelButtonText: this.$t('i18n.管理远程账号.取消'),
                        type: 'warning'
                    }).then(() =>{
                        this.enabledAccount(idList);
                    });
                }
            },
            enabledAccount(idList) {
                //call API
                this.getAccountList();
                this.common.notification('success', this.$t('i18n.管理远程账号.解禁远程主机账号成功'));
            },
            // enabled account end

            // create & update account info start
            initAccountInfo(accountInfo) {
                this.accountInfoDialogVisible = true;
                this.accountInfoDialog = {
                    isCreate: !accountInfo,
                    title: !accountInfo ? this.$t('i18n.管理远程账号.添加账号') : this.$t('i18n.管理远程账号.编辑账号详情'),
                    CProtocol: {
                        id: this.protocolTypeList[0].id,
                        name: this.protocolTypeList[0].name,
                        icon: this.protocolTypeList[0].icon
                    },
                    remotePort: !!accountInfo ? accountInfo['protocol_port'] : this.protocolTypeList[0].port,
                    authMethod: {
                        id: this.authTypeList[1].id,
                        name: this.authTypeList[1].name
                    },
                    remoteUserNameNotice: !!accountInfo ? accountInfo['username_prompt'] : 'ogin:',
                    remotePasswordNotice: !!accountInfo ? accountInfo['password_prompt'] : 'assword:',
                    remoteUserName: !!accountInfo ? accountInfo.username : '',
                    remotePassword: '',
                    privateKey: '',
                    protocolTypeList: this.protocolTypeList,
                    authTypeList: this.authTypeList,
                    rules: {
                        'CProtocol.name': [{
                            required: true, message: this.$t('i18n.管理远程账号.请选择连接协议'), trigger: 'blur'
                        }],
                        remotePort: [{
                            required: true, message: this.$t('i18n.管理远程账号.请输入远程主机端口'), trigger: 'blur'
                        }],
                        'authMethod.name': [{
                            required: true, message: this.$t('i18n.管理远程账号.请选择认证方式'), trigger: 'blur'
                        }],
                        remoteUserNameNotice: [{
                            required: true, message: this.$t('i18n.管理远程账号.请输入用户名提示'), trigger: 'blur'
                        }],
                        remotePasswordNotice: [{
                            required: true, message: this.$t('i18n.管理远程账号.请输入密码提示'), trigger: 'blur'
                        }],
                        remoteUserName: [{
                            required: true, message: this.$t('i18n.管理远程账号.请输入登陆远程主机的账号'), trigger: 'blur'
                        }],
                        remotePassword: [{
                            required: true, message: this.$t('i18n.管理远程账号.请输入登陆远程主机的密码'), trigger: 'blur'
                        }],
                        privateKey: [{
                            required: true, message: this.$t('i18n.管理远程账号.请输入登陆远程主机的私钥'), trigger: 'blur'
                        }],
                    }
                };
                // init account info
                if (!!accountInfo) {
                    for (let protocolTypeObj of this.accountInfoDialog.protocolTypeList) {
                        if (protocolTypeObj.id === accountInfo['protocol_type']) {
                            this.accountInfoDialog.CProtocol = {
                                id: protocolTypeObj.id,
                                name: protocolTypeObj.name,
                                icon: protocolTypeObj.icon
                            };
                            break;
                        }
                    }
                    for (let authTypeObj of this.accountInfoDialog.authTypeList) {
                        if (authTypeObj.id === accountInfo['auth_type']) {
                            this.accountInfoDialog.authMethod = {
                                id: authTypeObj.id,
                                name: authTypeObj.name
                            };
                            break;
                        }
                    }

                }
            },
            getAuthTypeList() {
                let authTypeList = [];

                if (this.accountInfoDialog.CProtocol.id === this.accountInfoDialog.protocolTypeList[0].id) {
                    authTypeList.push(this.authTypeList[1]);
                }else if (this.accountInfoDialog.CProtocol.id === this.accountInfoDialog.protocolTypeList[1].id) {
                    authTypeList.push(this.authTypeList[1]);
                    authTypeList.push(this.authTypeList[2]);
                }else if (this.accountInfoDialog.CProtocol.id === this.accountInfoDialog.protocolTypeList[2].id) {
                    authTypeList.push(this.authTypeList[1]);
                    authTypeList.push(this.authTypeList[0]);
                }
                return authTypeList;
            },
            updateCProtocol(protocolTypeObj) {
                if (protocolTypeObj && protocolTypeObj.id !== this.accountInfoDialog.CProtocol.id) {
                    this.accountInfoDialog.CProtocol = {
                        id: protocolTypeObj.id,
                        name: protocolTypeObj.name,
                        icon: protocolTypeObj.icon
                    };
                    this.accountInfoDialog.remotePort = protocolTypeObj.port;
                    this.accountInfoDialog.authMethod = {
                        id: this.accountInfoDialog.authTypeList[1].id,
                        name: this.accountInfoDialog.authTypeList[1].name
                    };
                    this.accountInfoDialog.remoteUserNameNotice = 'ogin:';
                    this.accountInfoDialog.remotePasswordNotice = 'assword:';
                    this.accountInfoDialog.remoteUserName = '';
                    this.accountInfoDialog.remotePassword = '';
                    this.accountInfoDialog.privateKey = '';
                }
            },
            updateAuthMethod(authTypeObj) {
                if (authTypeObj && authTypeObj.id !== this.accountInfoDialog.authMethod.id) {
                    this.accountInfoDialog.authMethod = {
                        id: authTypeObj.id,
                        name: authTypeObj.name
                    };
                    this.accountInfoDialog.remoteUserNameNotice = 'ogin:';
                    this.accountInfoDialog.remotePasswordNotice = 'assword:';
                    this.accountInfoDialog.remoteUserName = '';
                    this.accountInfoDialog.remotePassword = '';
                    this.accountInfoDialog.privateKey = '';
                }
            },
            cancelAccountInfoDialog() {
                this.$refs['accountInfoDialog'].resetFields();
                this.accountInfoDialogVisible = false;
            },
            submitAccountInfo() {
                this.$refs['accountInfoDialog'].validate((passValidate) => {
                    if (passValidate) {
                        this.accountInfoDialog.isCreate ? this.createAccountInfo() : this.updateAccountInfo();
                    }else {
                        return false;
                    }
                })
            },
            createAccountInfo() {
                // call API
                this.common.notification('success', this.$t('i18n.管理远程账号.添加远程账号成功'));
                this.accountInfoDialogVisible = false;
            },
            updateAccountInfo() {
                // call API
                this.common.notification('success', this.$t('i18n.管理远程账号.更新远程账号信息成功'));
                this.accountInfoDialogVisible = false;
            },
            // create & update account info end

            // delete account start
            confirmDeleteAccount(idList) {
                if (idList && idList[0]) {
                    this.$confirm('确认<span class="text-bold">"删除"</span>选中远程主机账号选中远程主机账号', this.$t('i18n.管理远程账号.删除'), {
                        dangerouslyUseHTMLString: true,
                        closeOnClickModal: false,
                        confirmButtonText: this.$t('i18n.管理远程账号.确定'),
                        cancelButtonText: this.$t('i18n.管理远程账号.取消'),
                        type: 'warning'
                    }).then(() =>{
                        this.deleteAccount(idList);
                    });
                }
            },
            deleteAccount(idList) {
                //call API
                this.filter.pageNation.pageNo = 1;
                this.getAccountList();
                this.common.notification('success', this.$t('i18n.管理远程账号.删除远程主机账号成功'));
            }
            // delete account end
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
#manageRemoteAccount{
    table{
        svg{
            padding-right: 5px;
        }
    }
}
</style>
