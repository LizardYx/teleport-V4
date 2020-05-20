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
                                <div>
                                    <icon-svg icon-class="ldapUser"></icon-svg>
                                    导入LDAP用户
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <div @click="initLdapSettingDialog">
                                    <icon-svg icon-class="setting"></icon-svg>
                                    LDAP设置
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="initUpdateRole(selectedIdList)">
                        {{$t('i18n.用户管理.设置角色')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="confirmDisabledUser(selectedIdList)">
                        {{$t('i18n.用户管理.禁用')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="confirmEnabledUser(selectedIdList)">
                        {{$t('i18n.用户管理.解禁')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="initDeleteUser(selectedIdList)">
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
            <el-dialog :title="userInfoDialog.title" :visible.sync="userInfoDialog.visible" width="768px"
                       :close-on-click-modal="false" :close-on-press-escape="false" v-if="userInfoDialog.visible">
                <el-form :model="userInfoDialog" status-icon :rules="userInfoDialog.rules" ref="userInfoDialog"
                         size="medium">
                    <el-form-item prop="role.id" label="角色:" label-width="100px">
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
                            <el-form-item prop="account" label="登录名:" label-width="100px">
                                <el-input v-model="userInfoDialog.account" placeholder="请输入登录名" size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="姓名:" label-width="100px">
                                <el-input v-model="userInfoDialog.name" placeholder="请输入姓名" size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="email" label="Email:" label-width="100px">
                                <el-input v-model="userInfoDialog.email" placeholder="请输入邮箱地址" size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="电话号码:" label-width="100px">
                                <el-input v-model="userInfoDialog.phone" placeholder="请输入电话号码" size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="QQ:" label-width="100px">
                                <el-input v-model="userInfoDialog.QQ" placeholder="请输入QQ账号" size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="微信:" label-width="100px">
                                <el-input v-model="userInfoDialog.WeChat" placeholder="请输入微信账号" size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="备注:" label-width="100px">
                                <el-input type="textarea" :rows="3" v-model="userInfoDialog.remark" size="mini"
                                          placeholder="请填写备注">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item prop="authWayTag" label="认证方式:" label-width="100px">
                        <el-radio-group v-model="userInfoDialog.authWayTag">
                            <el-radio v-for="authWayObj in userInfoDialog.authWayList" :key="authWayObj.id"
                                      :label="authWayObj.tag">
                                {{authWayObj.name}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="submitUserInfo">
                        <icon-svg icon-class="submit"></icon-svg>
                        确定
                    </el-button>
                    <el-button size="mini" @click="cancelEditUserInfo">
                        <icon-svg icon-class="cancel"></icon-svg>
                        取消
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog title="导入用户" :visible.sync="importUserDialog.visible" width="768px" v-if="importUserDialog.visible"
                       :close-on-click-modal="false" :close-on-press-escape="false">
                <el-upload ref="upload" drag :action="importUserDialog.uploadUrl" accept=".csv" :limit="importUserDialog.limit"
                           :on-exceed="uploadFileOutOfRange" :before-upload="beforeUploadFile" :auto-upload="false">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
                <div class="notice mar-top">
                    <label class="title box-block">温馨提示：</label>
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
                    <el-button type="primary" size="mini" @click="importUser">
                        <icon-svg icon-class="submit"></icon-svg>
                        确定
                    </el-button>
                    <el-button size="mini" @click="importUserDialog.visible = false">
                        <icon-svg icon-class="cancel"></icon-svg>
                        取消
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog title="LDAP设置" :visible.sync="ldapSettingDialog.visible" width="768px" v-if="ldapSettingDialog.visible"
                       :close-on-click-modal="false" :close-on-press-escape="false" class="ldap-setting">
                <div class="connect-info">
                    <div class="tag">LDAP连接配置</div>
                    <div class="content">
                        <el-form :model="ldapSettingDialog" status-icon :rules="ldapSettingDialog.rules" ref="ldapSettingDialog" size="medium">
                            <el-row>
                                <el-col :span="14">
                                    <el-form-item prop="host" label="LDAP主机:" label-width="120px">
                                        <el-input v-model="ldapSettingDialog.host" placeholder="LDAP服务器IP地址或域名" size="mini">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="14">
                                    <el-form-item prop="port" label="端口:" label-width="120px">
                                        <el-input v-model="ldapSettingDialog.port" placeholder="LDAP端口，默认为389" size="mini">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="14">
                                    <el-form-item prop="domain" label="域:" label-width="120px">
                                        <el-input v-model="ldapSettingDialog.domain" placeholder="LDAP账号使用'用户名@域'来登录teleport" size="mini">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="14">
                                    <el-form-item prop="managerDN" label="管理员DN:" label-width="120px">
                                        <el-input v-model="ldapSettingDialog.managerDN" placeholder="LDAP服务的管理员账号，用于列举用户、同步账号"
                                                  size="mini">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="14">
                                    <el-form-item prop="password" label="密码:" label-width="120px">
                                        <el-input v-model="ldapSettingDialog.password" show-password placeholder="LDAP服务的管理员密码" size="mini">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </div>
                <div class="filter-info">
                    <div class="tag">LDAP用户过滤配置</div>
                    <div class="content">
                        <el-form :model="ldapSettingDialog" status-icon :rules="ldapSettingDialog.rules" ref="ldapSettingDialog" size="medium">
                            <el-row>
                                <el-col :span="20">
                                    <el-form-item prop="userDN" label="用户基准DN:" label-width="120px">
                                        <el-input v-model="ldapSettingDialog.userDN" placeholder="限制用户DN的范围，例如：ou=dev,ou=company,ou=com"
                                                  size="mini">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="20">
                                    <el-form-item prop="filter" label="过滤器:" label-width="120px">
                                        <el-input v-model="ldapSettingDialog.filter" placeholder="列举用户时的过滤器，例如 (&(objectClass=person))"
                                                  size="mini">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </div>
                <div class="attribute-mapping">
                    <div class="tag">
                        属性映射
                        <el-popover placement="right" trigger="hover">
                            <div v-html="getAMappingDescription()"></div>
                            <el-link slot="reference" :underline="false">
                                <icon-svg icon-class="wenhao"></icon-svg>
                            </el-link>
                        </el-popover>
                    </div>
                    <el-form :model="ldapSettingDialog" status-icon :rules="ldapSettingDialog.rules" ref="ldapSettingDialog" size="medium">
                        <el-row>
                            <el-col :span="20">
                                <el-form-item prop="loginAccountKey" label="登录账号字段:" label-width="120px">
                                    <el-input v-model="ldapSettingDialog.loginAccountKey" placeholder="例如：sAMAccountName"
                                              size="mini">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="真实姓名字段:" label-width="120px">
                                    <el-input v-model="ldapSettingDialog.realNameKey" placeholder="例如：uid" size="mini">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="邮箱地址字段:" label-width="120px">
                                    <el-input v-model="ldapSettingDialog.emailKey" placeholder="例如：mail" size="mini">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini">
                        <icon-svg icon-class="shuxing"></icon-svg>
                        列举属性
                    </el-button>
                    <el-button type="primary" size="mini">
                        <icon-svg icon-class="shandian"></icon-svg>
                        测试获取用户
                    </el-button>
                    <el-button type="primary" size="mini">
                        <icon-svg icon-class="submit"></icon-svg>
                        保存设置
                    </el-button>
                    <el-button size="mini" @click="cancelLDAPSetting">
                        <icon-svg icon-class="cancel"></icon-svg>
                        取消
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog :title="userRoleDialog.title" :visible.sync="userRoleDialog.visible" width="768px"
                       :close-on-click-modal="false" :close-on-press-escape="false" v-if="userRoleDialog.visible">
                <el-form :model="userRoleDialog" status-icon :rules="userRoleDialog.rules" ref="userRoleDialog"
                         size="medium">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="account" label="已选用户:" label-width="100px">
                                <el-tag v-for="userObj in userRoleDialog.userList" :key="userObj.id" @close="removeUser(userObj.id)"
                                        :closable="userRoleDialog.userList.length > 1" size="small" class="mar-rgt mar-btm">
                                    {{userObj.name}}
                                </el-tag>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item prop="selectedRole.id" label="角色:" label-width="100px">
                        <el-dropdown trigger="click" @command="updateSelectedRole" size="mini" placement="bottom-start">
                            <el-button size="mini">
                                {{userRoleDialog.selectedRole.name}}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu solt="dropdown">
                                <el-dropdown-item v-for="roleObj in userRoleDialog.roleList" :command="roleObj"
                                                  :key="roleObj.id" v-text="roleObj.name">
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="confirmUpdateUserRole">
                        <icon-svg icon-class="submit"></icon-svg>
                        确定
                    </el-button>
                    <el-button size="mini" @click="cancelUpdateRole">
                        <icon-svg icon-class="cancel"></icon-svg>
                        取消
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="deleteUserDialog.visible" v-if="deleteUserDialog.visible" class="delete-dialog"
                       width="768px" :close-on-click-modal="false" :close-on-press-escape="false">
                <div slot="title" class="delete-title">
                    <icon-svg icon-class="warning"></icon-svg>操作确认
                </div>
                <div class="warning">
                    <div class="text-bold">注意：删除操作不可恢复！！</div>
                    <div>删除用户账号将同时将其从所在用户组中移除，并且删除所有分配给此用户的授权！</div>
                </div>
                <div class="mar-top">
                    您确定要"删除"选中的 <span class="text-bold">{{deleteUserDialog.idList.length}}个</span> 用户？<br/>
                    如果您希望临时禁止某个用户登录本系统，可将其状态设置为“禁用”。
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="deleteUser">确定</el-button>
                    <el-button size="mini" @click="deleteUserDialog.visible = false">取消</el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="resetPasswordDialog.visible" v-if="resetPasswordDialog.visible" class="delete-dialog"
                       width="768px" :close-on-click-modal="false" :close-on-press-escape="false">
                <div slot="title" class="delete-title">
                    重置密码:{{resetPasswordDialog.userName}}
                </div>
                <div>
                    <el-collapse v-model="resetPasswordDialog.activeItem">
                        <el-collapse-item title="邮件重置" name="email-reset">
                            <div>
                                向用户的邮箱 <span class="text-bold">{{resetPasswordDialog.email}}</span> 发送密码重置邮件，
                                然后用户可通过邮件中的密码重置链接自行设置新密码。
                                <el-button type="primary" size="mini" @click="sendResetPasswordEmail">
                                    <icon-svg icon-class="email"></icon-svg>
                                    发送密码重置邮件
                                </el-button>
                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="手动重置" name="manual-reset">
                            <div>
                                为用户设置新密码，并立即生效，需要通过其它方式告知用户新密码。
                            </div>
                            <div style="width: 50%;margin-bottom: 7px">
                                <el-input size="mini" placeholder="输入用户的新密码" v-model="resetPasswordDialog.newPassword">
                                    <template slot="append">
                                        <el-button style="box-shadow: none" @click="getRandomPassword">生成随机密码</el-button>
                                    </template>
                                </el-input>
                            </div>
                            <el-button type="primary" size="mini" @click="resetPassword">
                                <icon-svg icon-class="zhongzhimima"></icon-svg>
                                重置密码
                            </el-button>
                        </el-collapse-item>
                    </el-collapse>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="resetPasswordDialog.visible = false">取消</el-button>
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
                ldapSettingDialog: {
                    visible: false
                },
                userRoleDialog: {
                    visible: false
                },
                resetPasswordDialog: {
                    visible: false
                },
                deleteUserDialog: {
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
            canSelectUser(row, index) {
                return index !== 0;
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
                    this.$confirm(`确认"禁用"选中的 <span class="text-bold">${idList.length}个</span> 用户`, '禁用', {
                        dangerouslyUseHTMLString: true,
                        closeOnClickModal: false,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        cancelButtonClass: 'btn-cancel',
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
                    this.$confirm(`确认"解禁"选中的 <span class="text-bold">${idList.length}个</span> 用户`, '解禁', {
                        dangerouslyUseHTMLString: true,
                        closeOnClickModal: false,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        cancelButtonClass: 'btn-cancel',
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
                    title: !!userInfo ? `编辑用户信息: ${userInfo.surname}` : '创建新用户',
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
                            this.userInfoDialog.role = {
                                id: roleObj.id,
                                name: roleObj.name,
                                privilege: roleObj.privilege
                            };
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
                    this.$refs['userInfoDialog'].clearValidate(['role.id'])
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

            // ldap setting start
            initLdapSettingDialog() {
                //需要调用接口查询LDAP的配置，如果有配置，将数据填入下面的对象中
                this.ldapSettingDialog = {
                    visible: true,
                    host: '',
                    port: '',
                    domain: '',
                    managerDN: '',
                    password: '',
                    userDN: '',
                    filter: '',
                    loginAccountKey: '',
                    realNameKey: '',
                    emailKey: '',
                    rules: {
                        host: [
                            {required: true, message: '请输入LDAP服务器IP地址或域名', trigger: 'blur'}
                        ],
                        port: [
                            {required: true, message: '请输入LDAP端口', trigger: 'blur'}
                        ],
                        domain: [
                            {required: true, message: '请输入LDAP账号使用的域', trigger: 'blur'}
                        ],
                        managerDN: [
                            {required: true, message: '请输入LDAP服务的管理员账号', trigger: 'blur'}
                        ],
                        password: [
                            {required: true, message: '请输入LDAP服务的管理员密码', trigger: 'blur'}
                        ],
                        userDN: [
                            {required: true, message: '请输入限制用户DN的范围', trigger: 'blur'}
                        ],
                        filter: [
                            {required: true, message: '请输入列举用户时的过滤器', trigger: 'blur'}
                        ],
                        loginAccountKey: [
                            {required: true, message: '请输入登录账号字段。例如：sAMAccountName', trigger: 'blur'}
                        ],
                    }
                };
            },
            getAMappingDescription() {
                return `将LDAP的属性映射到 teleport 的用户属性，例如
                        <span style="color: #E6A23C">LDAP中的用户属性 sAMAccountName 映射为teleport的登录账号。</span><br/>
                        如果不清楚此LDAP服务的用户属性，可使用下方的“列举属性”按钮进行查询。`;
            },
            cancelLDAPSetting() {
                this.$refs['ldapSettingDialog'].resetFields();
                this.ldapSettingDialog.visible = false;
            },
            // ldap setting end

            // update role start
            initUpdateRole(userIdList) {
                if (userIdList && userIdList[0]) {
                    this.userRoleDialog = {
                        visible: true,
                        userList: [],
                        roleList: this.roleList,
                        selectedRole: {
                            id: '',
                            name: '请选择角色',
                            privilege: ''
                        },
                        rules: {
                            'selectedRole.id': [{
                                required: true, message: '请选择角色', trigger: 'change'
                            }],
                        }
                    };
                    // init user list
                    userIdList.forEach((userId) => {
                        for (const userObj of this.userList) {
                            if (userObj.id === userId) {
                                const newUserObj = {
                                    id: userObj.id,
                                    name: userObj.username
                                };

                                this.userRoleDialog.userList.push(newUserObj);
                                break;
                            }
                        }
                    });
                }
            },
            removeUser(userId) {
                for (let index = 0; index < this.userRoleDialog.userList.length; index++) {
                    const userObj = this.userRoleDialog.userList[index];

                    if (userObj.id === userId) {
                        this.userRoleDialog.userList.splice(index, 1);
                        break;
                    }
                }
            },
            updateSelectedRole(roleObj) {
                if (!!roleObj && (roleObj.id !== this.userRoleDialog.selectedRole.id)) {
                    this.userRoleDialog.selectedRole = {
                        id: roleObj.id,
                        name: roleObj.name,
                        privilege: roleObj.privilege
                    };
                    this.$refs['userRoleDialog'].clearValidate('selectedRole.id');
                }
            },
            cancelUpdateRole() {
                this.$refs['userRoleDialog'].resetFields();
                this.userRoleDialog.visible = false;
            },
            confirmUpdateUserRole() {
                this.$refs['userRoleDialog'].validate((passValidate) => {
                    if (passValidate) {
                        this.$confirm(`确认将 <span class="text-bold">${this.userRoleDialog.userList.length}个</span>
                                        选中用户的角色设置为"${this.userRoleDialog.selectedRole.name}"`,
                            '设置角色', {
                            dangerouslyUseHTMLString: true,
                            closeOnClickModal: false,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            cancelButtonClass: 'btn-cancel',
                            type: 'warning'
                        }).then(() =>{
                            this.updateUserRole();
                        });
                    }else {
                        return false;
                    }
                })
            },
            updateUserRole() {
                let params = {
                    users: [],
                    role_id: this.userRoleDialog.selectedRole.id
                };

                this.userRoleDialog.userList.forEach((userObj) => {
                    params.users.push(userObj.id);
                });
                asyncPost(api.updateUserRole, params)
                    .then(() => {
                        this.$refs['userRoleDialog'].resetFields();
                        this.userRoleDialog.visible = false;
                        this.getUserList();
                        this.common.notification('success', '设置用户角色成功');
                    }, (error) => {
                        this.common.notification('warning', error.msg);
                    });
            },
            // update role end

            // reset oath start
            confirmResetOath(userId) {
                this.$confirm('确认将选中用户的"身份验证器"重置', '重置身份验证器', {
                    dangerouslyUseHTMLString: true,
                    closeOnClickModal: false,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: 'btn-cancel',
                    type: 'warning'
                }).then(() =>{
                    this.resetOath(userId);
                });
            },
            resetOath(userId) {
                //Call API
                this.getUserList();
                this.common.notification('success', '重置身份验证器成功');
            },
            // reset oath end

            // reset password start
            initResetPassword(userInfo) {
                if (!!userInfo) {
                    this.resetPasswordDialog = {
                        visible: true,
                        userId: userInfo.id,
                        userName: userInfo.username,
                        email: userInfo.email,
                        activeItem: ['email-reset', 'manual-reset'],
                        newPassword: '',
                    };
                }
            },
            sendResetPasswordEmail() {
                //Call API
                this.common.notification('success', '发送密码重置邮件成功');
            },
            getRandomPassword() {
                this.resetPasswordDialog.newPassword = this.common.getRandomPassword(8);
            },
            resetPassword() {
                //Call API
                this.common.notification('success', '重置密码成功');
            },
            // reset password end

            // delete user start
            initDeleteUser(idList) {
                this.deleteUserDialog = {
                    visible: true,
                    idList: idList
                };
            },
            deleteUser(idList) {
                // Call API
                this.deleteUserDialog.visible = false;
                this.filter.pageNation.pageNo = 1;
                this.getUserList();
                this.common.notification('success', '删除用户成功');
            },
            // delete user end
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

<style lang="scss">
    #users{
        .tool-bar{
            div.el-dropdown{
                padding: 0 10px;
            }
        }
        div.ldap-setting{
            div.el-dialog__header{
                box-shadow: 0 1px 5px 0 #DCDFE6;
            }
            div.el-dialog__body{
                max-height: 600px;
                overflow-y: auto;
                >div{
                    padding-bottom: 15px;
                    padding-top: 30px;
                    border-bottom: 1px solid #DCDFE6;
                    &:first-child{
                        padding-top: 0;
                    }
                    &:last-child{
                        border-bottom: none;
                    }
                    >div.tag{
                        border-left: 3px solid $color-main;
                        padding-left: 15px;
                        margin-bottom: 15px;
                        font-weight: bold;
                    }
                    >div.content{
                        margin-left: 18px;
                    }
                }
            }
            div.el-dialog__footer{
                box-shadow: 0 -1px 5px 0 #DCDFE6;
            }
        }
    }
</style>
