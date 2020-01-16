<template>
    <div id="hostGroup">
        <el-breadcrumb id="pageTitle" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>{{$t('i18n.导航页面.主机分组管理')}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="pageContent">
            <el-row :gutter="20" class="tool-bar">
                <el-col :span="18">
                    <el-button size="mini" type="primary">
                        <i class="el-icon-circle-plus-outline"></i>
                        {{$t('i18n.主机分组管理.创建主机分组')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]">
                        {{$t('i18n.主机分组管理.禁用')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]">
                        {{$t('i18n.主机分组管理.解禁')}}
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]">
                        <i class="el-icon-delete"></i>
                        {{$t('i18n.主机分组管理.删除')}}
                    </el-button>
                    <el-button size="mini" type="primary">
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
                <el-table :data="hostGroupList" border @selection-change="updateSelected" @sort-change="updateFilter">
                    <el-table-column align="center" type="selection"></el-table-column>
                    <el-table-column header-align="center" sortable="custom" :label="$t('i18n.主机分组管理.名称')">
                        <template slot-scope="scope">
                            <edit-input :id="scope['row'].id" :name="scope['row'].name" :desc="scope['row'].desc"
                                        :callback="updateMainframeName">
                            </edit-input>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" prop="host_count" :label="$t('i18n.主机分组管理.主机数')"></el-table-column>
                    <el-table-column header-align="center" :label="$t('i18n.主机分组管理.主机名称')">
                        <template slot-scope="scope">
                            <el-tag size="small" type="info" v-for="hostObj in scope['row'].hostList" :command="hostObj.id" class="host-info">
                                <el-tooltip effect="dark" :content="getOperationSystemInfo(hostObj['os_type']).name" placement="left">
                                    <icon-svg :icon-class="getOperationSystemInfo(hostObj['os_type']).icon"></icon-svg>
                                </el-tooltip>
                                {{hostObj.name}}({{hostObj.ip}})
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :label="$t('i18n.主机分组管理.状态')">
                        <template slot-scope="scope">
                            <el-tag effect="dark" v-text="getGroupStatusInfo(scope['row'].state).name"  size="small"
                                    :type="getGroupStatusInfo(scope['row'].state).css">
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" :label="$t('i18n.主机分组管理.操作')">
                        <template slot-scope="scope">
                            <el-link type="primary" class="mar-rgt" :underline="false" v-text="$t('i18n.主机分组管理.禁用')">
                            </el-link>
                            <el-link type="primary" class="mar-rgt" :underline="false" v-text="$t('i18n.主机分组管理.解禁')">
                            </el-link>
                            <el-dropdown trigger="click">
                                <span>
                                    {{$t('i18n.主机分组管理.更多操作')}}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown" class="operation">
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" v-text="$t('i18n.主机分组管理.编辑详情')">
                                        </el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" v-text="$t('i18n.主机分组管理.删除')">
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
                    }
                },
                selectedIdList: [],
                hostGroupList: [],
                hostsStatusList: this.common.statusList,
                osTypeList: this.common.osTypeList,
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
                asyncGet(api.getHostGroupList, params)
                    .then((response) => {
                        let res = response && response.rows ? response.rows : {};

                        this.hostGroupList = res && res.data ? res.data : [];
                        this.filter.pageNation.totalItem = res && res.count ? res.count : 0;
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
            updateMainframeName(id, name) {
                //call API update mainframe name
                this.common.notification('success', this.$t('i18n.主机分组管理.更新主机名称成功'));
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
