<template>
    <div id="users">
        <el-breadcrumb id="pageTitle" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>{{$t('i18n.导航页面.用户管理')}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="pageContent">
            <el-row :gutter="20" class="tool-bar">
                <el-col :span="18">
                    <el-button size="mini" type="primary">
                        <i class="el-icon-circle-plus-outline"></i>
                        {{$t('i18n.用户管理.创建用户')}}
                    </el-button>
                    <el-button size="mini" type="primary">
                        <i class="el-icon-circle-plus-outline"></i>
                        {{$t('i18n.用户管理.导入用户')}}
                    </el-button>
                    <el-button size="mini" type="primary">
                        {{$t('i18n.用户管理.LDAP管理')}}
                    </el-button>
                    <el-button size="mini" type="primary">
                        {{$t('i18n.用户管理.设置角色')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]">
                        {{$t('i18n.用户管理.禁用')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]">
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
                            <el-link type="primary" class="mar-rgt" :underline="false" v-text="$t('i18n.用户管理.禁用')">
                            </el-link>
                            <el-link type="primary" class="mar-rgt" :underline="false" v-text="$t('i18n.用户管理.解禁')">
                            </el-link>
                            <el-dropdown trigger="click">
                                <span>
                                    {{$t('i18n.用户管理.更多操作')}}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown" class="operation">
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" v-text="$t('i18n.用户管理.删除')">
                                        </el-link>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <fix-tool-bar ref="toolbar"></fix-tool-bar>
    </div>
</template>

<script>
    import {asyncGet} from '@src/assets/axios'
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
