<template>
    <div id="users">
        <el-breadcrumb id="pageTitle" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>{{$t('i18n.导航页面.用户管理')}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="pageContent">
            <el-row :gutter="20" class="tool-bar">
                <el-col :span="18">
                    <el-button size="mini" type="primary" @click="initUserInfoDialog">
                        <i class="el-icon-circle-plus-outline"></i>
                        {{$t('i18n.用户管理.创建用户')}}
                    </el-button>
                    <el-button size="mini" type="primary" @click="initImportUser">
                        <i class="el-icon-circle-plus-outline"></i>
                        {{$t('i18n.用户管理.导入用户')}}
                    </el-button>
                    <el-dropdown size="mini" trigger="click">
                        <el-button size="mini" type="primary">
                            {{$t('i18n.用户管理.LDAP管理')}}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <icon-svg icon-class="ldapUser"></icon-svg>
                                导入LDAP用户
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <icon-svg icon-class="setting"></icon-svg>
                                LDAP设置
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button size="mini" type="primary">
                        {{$t('i18n.用户管理.设置角色')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="confirmDisabledUser(selectedIdList)">
                        {{$t('i18n.用户管理.禁用')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="confirmEnabledUser(selectedIdList)">
                        {{$t('i18n.用户管理.解禁')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]">
                        <i class="el-icon-delete"></i>
                        {{$t('i18n.用户管理.删除')}}
                    </el-button>
                    <el-button size="mini" type="primary" @click="getUserList()">
                        <i class="el-icon-refresh"></i>
                        {{$t('i18n.用户管理.刷新列表')}}
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <el-input :class="{'search': true, 'searching': !!filter.searchValue}" prefix-icon="el-icon-search"
                              size="mini" :placeholder="$t('i18n.用户管理.搜索：用户账号/姓名/邮箱/描述')"
                              v-model="filter.searchValue" maxlength="50">
                    </el-input>
                </el-col>
            </el-row>
            <div class="mar-btm">
                <el-table :data="userList" border @selection-change="updateSelected" @sort-change="updateFilter"
                          @filter-change="filterChange">
                    <el-table-column min-width="5%" align="center" type="selection"></el-table-column>
                    <el-table-column min-width="15%" header-align="center" prop="user" sortable="custom" :label="$t('i18n.用户管理.名称')">
                        <template slot-scope="scope">
                            <el-link type="primary" :underline="false">{{scope['row'].username}}</el-link>
                        </template>
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
                        <template slot-scope="scope">
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
                                        <el-link type="primary" :underline="false">编辑用户信息</el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false">重置密码</el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false">重置身份验证器</el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false">删除</el-link>
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
            <el-dialog :title="userInfoDialog.title" :visible.sync="userInfoDialog.visible" width="768px"
                       :close-on-click-modal="false" :close-on-press-escape="false" v-if="userInfoDialog.visible">
                <el-form :model="userInfoDialog" status-icon :rules="userInfoDialog.rules" ref="userInfoDialog"
                         size="medium">
                    <el-form-item prop="role.id" label="角色" label-width="80px">
                        <el-dropdown trigger="click" @command="updateRole" size="mini" placement="bottom-start">
                            <el-button size="mini">
                                {{userInfoDialog.role.name}}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu solt="dropdown">
                                <el-dropdown-item v-for="roleObj in userInfoDialog.roleList" :command="roleObj"
                                                  :key="roleObj.id" v-text="roleObj.name">
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="account" label="登录名" label-width="80px">
                                <el-input v-model="userInfoDialog.account" placeholder="请输入登录名" size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="姓名" label-width="80px">
                                <el-input v-model="userInfoDialog.name" placeholder="请输入姓名" size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="email" label="Email" label-width="80px">
                                <el-input v-model="userInfoDialog.email" placeholder="请输入邮箱地址" size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="电话号码" label-width="80px">
                                <el-input v-model="userInfoDialog.phone" placeholder="请输入电话号码" size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="QQ" label-width="80px">
                                <el-input v-model="userInfoDialog.QQ" placeholder="请输入QQ账号" size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="微信" label-width="80px">
                                <el-input v-model="userInfoDialog.WeChat" placeholder="请输入微信账号" size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="备注" label-width="80px">
                                <el-input type="textarea" :rows="3" v-model="userInfoDialog.remark" size="mini"
                                          placeholder="请填写备注">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item prop="authWayTag" label="认证方式" label-width="80px">
                        <el-radio-group v-model="userInfoDialog.authWayTag">
                            <el-radio v-for="authWayObj in userInfoDialog.authWayList" :key="authWayObj.id"
                                      :label="authWayObj.tag">
                                {{authWayObj.name}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="submitUserInfo">确定</el-button>
                    <el-button size="mini" @click="cancelEditUserInfo">取消</el-button>
                </div>
            </el-dialog>
            <el-dialog title="倒入用户" :visible.sync="importUserDialog.visible" width="768px" v-if="importUserDialog.visible"
                       :close-on-click-modal="false" :close-on-press-escape="false">
                <el-upload ref="upload" drag :action="importUserDialog.uploadUrl" accept=".csv" :limit="importUserDialog.limit"
                           :on-exceed="uploadFileOutOfRange" :before-upload="beforeUploadFile" :auto-upload="false">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
                <div class="notice mar-top">
                    <label class="title box-block">温馨提示</label>
                    <div class="content">
                        <span>
                            导入用户需要上传csv格式的文件，您可以下载
                            <a href="../../../../file/teleport-example-user.csv"
                               download="teleport-example-user.csv">
                                用户信息文件模版
                            </a>
                            进行编辑。
                        </span>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="importUser">确定</el-button>
                    <el-button size="mini" @click="importUserDialog.visible = false">取消</el-button>
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
        name: "user-manage",
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
                userList: [],
                roleList: [],
                userInfoDialog: {
                    visible: false
                },
                importUserDialog: {
                    visible: false
                },
                statusList: this.common.statusList,
                userTypeList: this.common.userTypeList,
            }
        },
        methods: {
            initPageInfo() {
                this.getUserList();
                this.getRoleList();
            },
            updateFilter(column) {
                this.filter.sort = {
                    name: column.prop,
                    order: column.order
                };
                this.getUserList();
            },
            filterChange(filterObj) {
                for (let key in filterObj) {
                    const filterValue = filterObj[key][0];

                    if (this.filter[key] !== filterValue) {
                        this.filter[key] = filterValue;
                        this.getUserList();
                    }
                }
            },
            getUserList() {
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
                asyncGet(api.getUserList, params)
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
            getUserTypeTile() {
                let userTypeTitle = this.$t('i18n.用户管理.全部');

                if (this.filter.type) {
                    for (let userTypeObj of this.userTypeList) {
                        if (userTypeObj.id === this.filter.type) {
                            userTypeTitle = userTypeObj.name;
                            break;
                        }
                    }
                }
                return `${this.$t('i18n.用户管理.类型')}(${userTypeTitle})`;
            },
            getUserTypeFilterList() {
                let filterList = [];

                this.userTypeList.forEach(function (userTypeObj) {
                    const newFilterObj = {
                        text: userTypeObj.name,
                        value: userTypeObj.id
                    };

                    filterList.push(newFilterObj);
                });
                return filterList;
            },
            getUserType(typeId) {
                let type = '-';

                if (typeId) {
                    for (let userTypeObj of this.userTypeList) {
                        if (userTypeObj.id === typeId) {
                            type = userTypeObj.name;
                            break;
                        }
                    }
                }
                return type;
            },
            getUserRoleTitle() {
                let userRoleTitle = this.$t('i18n.用户管理.全部');

                if (this.filter.role) {
                    for (let roleObj of this.roleList) {
                        if (roleObj.id === this.filter.role) {
                            userRoleTitle = roleObj.name;
                            break;
                        }
                    }
                }
                return `${this.$t('i18n.用户管理.角色')}(${userRoleTitle})`;
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
            getUserRole(roleId) {
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
                let userStatusTitle = this.$t('i18n.用户管理.全部');

                if (this.filter.status) {
                    for (let statusObj of this.statusList) {
                        if (statusObj.id === this.filter.status) {
                            userStatusTitle = statusObj.name;
                            break;
                        }
                    }
                }
                return `${this.$t('i18n.用户管理.状态')}(${userStatusTitle})`;
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
                this.getUserList();
            },
            changeCurrentPage(newPageNo) {
                this.filter.pageNation.pageNo = newPageNo;
                this.getUserList();
            },
            // disabled user start
            confirmDisabledUser(idList) {
                if (idList && idList[0]) {
                    this.$confirm('确认禁用用户', '禁用', {
                        closeOnClickModal: false,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() =>{
                        this.disableUser(idList);
                    });
                }
            },
            disableUser(idList) {
                //call API
                this.getUserList();
                this.common.notification('success', '禁用用户成功');
            },
            // disabled user end

            // confirm enabled user start
            confirmEnabledUser(idList) {
                if (idList && idList[0]) {
                    this.$confirm('确认解禁用户', '解禁', {
                        closeOnClickModal: false,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() =>{
                        this.enableUser(idList);
                    });
                }
            },
            enableUser(idList) {
                //call API
                this.getUserList();
                this.common.notification('success', '解禁用户成功');
            },
            // confirm enabled user end

            // user info dialog start
            initUserInfoDialog(userInfo) {
                this.userInfoDialog = {
                    visible: true,
                    isCreate: !userInfo,
                    title: !!userInfo ? '编辑用户信息' : '创建新用户',
                    id: !!userInfo ? userInfo.id : -1,
                    role: {
                        id: '',
                        name: '请选择角色',
                        privilege: ''
                    },
                    account: !!userInfo ? userInfo.username : '',
                    name: !!userInfo ? userInfo.surname : '',
                    email: !!userInfo ? userInfo.email : '',
                    phone: '',
                    QQ: '',
                    WeChat: '',
                    remark: '',
                    authWayTag: !!userInfo ? userInfo['auth_type'] : '',
                    roleList: this.roleList,
                    authWayList: this.common.allAuthWay,
                    rules: {
                        'role.id': [{
                            required: true, message: '请选择一个角色', trigger: 'change'
                        }],
                        account: [
                            {required: true, message: '登录名由英文字母和数字组成，最长32个字符', trigger: 'blur'}
                        ],
                        email: [
                            {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
                        ],
                        authWayTag: [{
                            required: true, message: '请选择认证方式', trigger: 'change'
                        }]
                    }
                };
                if (!!userInfo) {
                    // init role
                    for (const roleObj of this.userInfoDialog.roleList) {
                        if (roleObj.id === userInfo['role_id']) {
                            this.updateRole(roleObj);
                            break;
                        }
                    }
                }
            },
            updateRole(roleObj) {
                if (!!roleObj && (roleObj.id !== this.userInfoDialog.role.id)) {
                    this.userInfoDialog.role = {
                        id: roleObj.id,
                        name: roleObj.name,
                        privilege: roleObj.privilege
                    };
                    this.$refs['userInfoDialog'].clearValidate('role.id');
                }
            },
            cancelEditUserInfo() {
                this.$refs['userInfoDialog'].resetFields();
                this.userInfoDialog.visible = false;
            },
            submitUserInfo() {
                this.$refs['userInfoDialog'].validate((passValidate) => {
                    if (passValidate) {
                        this.updateUserInfo();
                    }else {
                        return false;
                    }
                })
            },
            updateUserInfo() {
                const dialog = this.userInfoDialog;
                let params = {
                    id: dialog.id, // -1:新增用户
                    role: dialog.role.id,
                    auth_type: dialog.authWayTag,
                    username: dialog.account,
                    surname: dialog.name,
                    email: dialog.email,
                    mobile: dialog.phone,
                    qq: dialog.QQ,
                    wechat: dialog.WeChat,
                    desc: dialog.remark
                };

                asyncPost(api.updateUserInfo, params)
                    .then(() => {
                        this.$refs['userInfoDialog'].resetFields();
                        this.userInfoDialog.visible = false;
                        this.common.notification('success', `${dialog.isCreate ? '新增用户' : '更新用户信息'}成功`);
                    }, (error) => {
                        this.common.notification('warning', error.msg);
                });
            },
            // user info dialog end

            // import user start
            initImportUser() {
                this.importUserDialog = {
                    visible: true,
                    uploadUrl: this.common.uploadUrl,
                    limit: 1,
                    fileList: []
                };
            },
            uploadFileOutOfRange() {
                this.common.notification('warning', '单次只能导入一个资产文件');
            },
            beforeUploadFile(file) {
                const fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
                const isCSV = fileType === 'csv';

                if (!isCSV) {
                    this.common.notification('warning', '资产文件必须为csv格式');
                }
                return isCSV;
            },
            importUser() {
                this.$refs.upload.submit();
                this.importUserDialog.visible = false;
            },
            // import user end
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
    #users{
        .tool-bar{
            div.el-dropdown{
                padding: 0 10px;
            }
        }
    }
</style>
