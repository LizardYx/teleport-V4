<template>
    <div id="userGroupDetails">
        <el-breadcrumb id="pageTitle" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>运维策略</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="pageContent">
            <el-row :gutter="20" class="tool-bar">
                <el-col :span="18">
                    <el-button size="mini" type="primary" @click="initPoliciesInfo()">
                        <i class="el-icon-circle-plus-outline"></i>
                        新建授权策略
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="confirmDisabledPolicies(selectedIdList)">
                        禁用
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="confirmEnabledPolicies(selectedIdList)">
                        解禁
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]" @click="initDeleteOpsPolicies(selectedIdList)">
                        <i class="el-icon-delete"></i>
                        删除
                    </el-button>
                    <el-button size="mini" type="primary" @click="getAuthList()">
                        <i class="el-icon-refresh"></i>
                        刷新列表
                    </el-button>
                </el-col>
                <el-col :span="6"></el-col>
            </el-row>
            <div class="mar-btm">
                <el-table :data="authList" border @selection-change="updateSelected">
                    <el-table-column min-width="5%" align="center" type="selection"></el-table-column>
                    <el-table-column min-width="55%" header-align="center" prop="name" label="授权策略">
                        <template slot-scope="scope">
                            <edit-input :id="scope['row'].id" :name="scope['row'].name" :desc="scope['row'].desc"
                                        :callback="updateOpsPoliciesName">
                            </edit-input>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" align="center" prop="status" label="状态">
                        <template slot-scope="scope">
                            <el-tag effect="dark" v-text="getUserStatusInfo(scope['row'].state).name"  size="small"
                                    :type="getUserStatusInfo(scope['row'].state).css">
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="20%" align="center" label="操作">
                        <template slot-scope="scope">
                            <el-link type="primary" class="mar-rgt" :underline="false" :disabled="scope['row'].state === statusList[1].id"
                                     @click="confirmDisabledPolicies([scope['row'].id])">
                                禁用
                            </el-link>
                            <el-link type="primary" class="mar-rgt" :underline="false" :disabled="scope['row'].state === statusList[0].id"
                                     @click="confirmEnabledPolicies([scope['row'].id])">
                                解禁
                            </el-link>
                            <el-dropdown size="small" trigger="click">
                                <span>
                                    更多操作
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown" class="operation">
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" @click="initPoliciesInfo(scope['row'])">
                                            运维策略基本信息
                                        </el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" @click="initLinkControl(scope['row'].id, scope['row'].name)">
                                            连接控制
                                        </el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false">
                                            运维策略详情
                                        </el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false" @click="initDeleteOpsPolicies([scope['row'].id])">
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
                    <el-col :span="12">
                        <div class="notice">
                            <label class="title box-block">温馨提示：</label>
                            <div class="content">
                                <div>
                                    1.上下拖动表格的行，可以调节策略的检查顺序
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
            <el-dialog :title="opsPoliciesInfoDialog.title" :visible.sync="opsPoliciesInfoDialog.visible" width="768px"
                       :close-on-click-modal="false" :close-on-press-escape="false" v-if="opsPoliciesInfoDialog.visible">
                <el-form :model="opsPoliciesInfoDialog" status-icon :rules="opsPoliciesInfoDialog.rules" ref="opsPoliciesInfoDialog"
                         size="medium">
                    <el-row>
                        <el-col :span="10">
                            <el-form-item prop="name" label="名称:" label-width="120px">
                                <el-input v-model="opsPoliciesInfoDialog.name" placeholder="请输入运维策略名称" size="mini">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="简要描述:" label-width="120px">
                                <el-input type="textarea" :rows="3" v-model="opsPoliciesInfoDialog.desc" size="mini"
                                          placeholder="请输入运维策略描述">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="submitOpsPoliciesInfo()">
                        <icon-svg icon-class="submit"></icon-svg>
                        确定
                    </el-button>
                    <el-button size="mini" @click="cancelOpsPoliciesDialog()">
                        <icon-svg icon-class="cancel"></icon-svg>
                        取消
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="deleteOpsPoliciesDialog.visible" v-if="deleteOpsPoliciesDialog.visible" class="delete-dialog"
                       width="768px" :close-on-click-modal="false" :close-on-press-escape="false">
                <div slot="title" class="delete-title">
                    <icon-svg icon-class="warning"></icon-svg>操作确认
                </div>
                <div class="warning">
                    <div class="text-bold">注意：删除操作不可恢复！！</div>
                </div>
                <div class="mar-top">
                    您确定要"删除"选中的 <span class="text-bold">{{deleteOpsPoliciesDialog.idList.length}}个</span> 运维策略？<br/>
                    如果您希望临时禁止某个指定的运维策略，可将其状态设置为“禁用”。
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="deletePolicies">确定</el-button>
                    <el-button size="mini" @click="deleteOpsPoliciesDialog.visible = false">取消</el-button>
                </div>
            </el-dialog>
            <el-dialog title="连接控制" :visible.sync="linkControlDialog.visible" width="768px" id="link-control"
                       :close-on-click-modal="false" :close-on-press-escape="false" v-if="linkControlDialog.visible">
                <el-form :model="linkControlDialog" status-icon ref="linkControlDialog" size="medium">
                    <div class="checkbox-block">
                        <div>
                            <el-checkbox :indeterminate="linkControlDialog.rdp.isIndeterminate" v-model="linkControlDialog.rdp.checkAll"
                                         @change="RDPSelectAll">
                                RDP选项
                            </el-checkbox>
                            <el-checkbox-group v-model="linkControlDialog.rdp.checkedItems" @change="RDPItemChange">
                                <el-checkbox v-for="itemInfo in linkControlDialog.rdp.items" :label="itemInfo.id" :key="itemInfo.id">
                                    {{itemInfo.name}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <div class="checkbox-block">
                        <div>
                            <el-checkbox :indeterminate="linkControlDialog.ssh.isIndeterminate" v-model="linkControlDialog.ssh.checkAll"
                                         @change="sshSelectAll">
                                SSH选项
                            </el-checkbox>
                            <el-checkbox-group v-model="linkControlDialog.ssh.checkedItems" @change="sshItemChange">
                                <el-checkbox v-for="itemInfo in linkControlDialog.ssh.items" :label="itemInfo.id" :key="itemInfo.id">
                                    {{itemInfo.name}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="submitLinkControlInfo()">
                        <icon-svg icon-class="submit"></icon-svg>
                        确定
                    </el-button>
                    <el-button size="mini" @click="cancelLinkControlDialog()">
                        <icon-svg icon-class="cancel"></icon-svg>
                        取消
                    </el-button>
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
    import EditInput from "@src/components/edit-input";
    import Sortable from "sortablejs";

    export default {
        name: "authorization",
        components: {FixToolBar, EditInput, Sortable},
        data() {
            return{
                filter: {
                    pageNation: this.common.initPageNation(),
                },
                selectedIdList: [],
                authList: [],
                statusList: this.common.statusList,
                opsPoliciesInfoDialog: {
                    visible: false
                },
                deleteOpsPoliciesDialog: {
                    visible: false
                },
                linkControlDialog: {
                    visible: false
                }
            }
        },
        methods: {
            initPageInfo() {
                this.getAuthList();
            },
            getAuthList() {
                let params = {
                    pageNo: this.filter.pageNation.pageNo,
                    pageSize: this.filter.pageNation.pageSize
                };

                asyncGet(api.getPoliciesList, params)
                    .then((response) => {
                        let res = response && response.rows ? response.rows : {};

                        this.authList = res && res.data ? res.data : [];
                        this.filter.pageNation.totalItem = res && res.count ? res.count : 0;
                        this.selectedIdList = [];
                    }, (error) => {
                        this.common.notification('warning', error.msg);
                    })
            },
            pageSizeChange(newPageSize) {
                this.filter.pageNation.pageSize = newPageSize;
                this.filter.pageNation.pageNo = 1;
                this.getAuthList();
            },
            changeCurrentPage(newPageNo) {
                this.filter.pageNation.pageNo = newPageNo;
                this.getAuthList();
            },
            updateSelected(selectedItemList) {
                let selectedIdList = [];

                selectedItemList.forEach(function (selectedItemObj) {
                    selectedIdList.push(selectedItemObj.id);
                });
                this.selectedIdList = selectedIdList;
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
            rowDrop() {
                const that = this;

                const tbody = document.querySelector(".el-table__body-wrapper tbody");
                Sortable.create(tbody, {
                    animation: 200,  //定义排序动画时间
                    onUpdate(evt) {
                        that.updateSort(evt.oldIndex, evt.newIndex)
                    }
                });
            },
            updateSort(oldIndex, newIndex) {
                const fromItem = this.authList[oldIndex];
                const targetItem = this.authList[newIndex];
                const direct = oldIndex - newIndex > 0 ? 1 : -1;
                let params = {
                    pid: fromItem.id,
                    new_rank: targetItem.rank,
                    start_rank: direct === 1 ? targetItem.rank : fromItem.rank + 1,
                    end_rank: direct === 1 ? fromItem.rank - 1 : targetItem.rank,
                    direct: direct
                };

                asyncPost(api.updatePoliciesOrder, params)
                    .then(() => {
                        this.common.notification('success', "授权策略顺序调整成功");
                        this.getAuthList();
                    }, (error) => {
                        this.common.notification('warning', error.msg);
                    })
            },
            updateOpsPoliciesName() {
                //call API update ops policies name
                this.common.notification('success', "更新运维策略名称成功");
            },

            // ops policies info start
            initPoliciesInfo(policiesInfo) {
                this.opsPoliciesInfoDialog = {
                    visible: true,
                    isCreate: !policiesInfo,
                    title: !!policiesInfo ? `运维策略基本信息：${policiesInfo.name}` : "创建运维策略",
                    name: !!policiesInfo ? policiesInfo.name : "",
                    desc: !!policiesInfo ? policiesInfo.desc : "",
                    rules: {
                        name: [{
                            required: true, message: '请输入运维策略名称', trigger: 'blur'
                        }],
                    }
                }
            },
            submitOpsPoliciesInfo() {
                this.$refs['opsPoliciesInfoDialog'].validate((passValidate) => {
                    if (passValidate) {
                        this.opsPoliciesInfoDialog.isCreate ? this.createOpsPolicies() : this.updateOpsPolicies();
                    }else {
                        return false;
                    }
                })
            },
            createOpsPolicies() {
                // call API
                this.common.notification('success', '创建运维策略成功');
                this.opsPoliciesInfoDialog.visible = false;
            },
            updateOpsPolicies() {
                // call API
                this.common.notification('success', '更新运维策略成功');
                this.opsPoliciesInfoDialog.visible = false;
            },
            cancelOpsPoliciesDialog() {
                this.$refs['opsPoliciesInfoDialog'].resetFields();
                this.opsPoliciesInfoDialog.visible = false;
            },
            // ops policies info end

            // link control start
            initLinkControl(policiesId, policiesName) {
                // call API 获取rpd和ssh的值
                const rdp = 4103;
                const ssh = 3;
                this.linkControlDialog = {
                    visible: true,
                    policiesId: policiesId,
                    policiesName: policiesName,
                    rdp: {
                        checkAll: false,
                        isIndeterminate: false,
                        checkedItems: [],
                        items: [{
                            id: 1,
                            name: "允许剪切板",
                        },{
                            id: 2,
                            name: "允许驱动器映射",
                        },{
                            id: 3,
                            name: "允许管理员连接(Console模式)",
                        }],
                    },
                    ssh: {
                        checkAll: false,
                        isIndeterminate: false,
                        checkedItems: [],
                        items: [{
                            id: 1,
                            name: "允许SSH",
                        },{
                            id: 2,
                            name: "允许SFTP",
                        }],
                    }
                };
                // 初始化连接控制选项是否选中
                if ((rdp & this.common.TP_FLAG_RDP_CLIPBOARD) !== 0) {
                    this.linkControlDialog.rdp.checkedItems.push(1)
                }
                if ((rdp & this.common.TP_FLAG_RDP_DISK) !== 0) {
                    this.linkControlDialog.rdp.checkedItems.push(2)
                }
                if ((rdp & this.common.TP_FLAG_RDP_CONSOLE) !== 0) {
                    this.linkControlDialog.rdp.checkedItems.push(3)
                }
                if ((ssh & this.common.TP_FLAG_SSH_SHELL) !== 0) {
                    this.linkControlDialog.ssh.checkedItems.push(1)
                }
                if ((ssh & this.common.TP_FLAG_SSH_SHELL) !== 0) {
                    this.linkControlDialog.ssh.checkedItems.push(2)
                }
            },

            RDPSelectAll(selectAll) {
                let itemIdList = [];

                for (let itemInfo of this.linkControlDialog.rdp.items) {
                    itemIdList.push(itemInfo.id);
                }
                this.linkControlDialog.rdp.checkedItems = selectAll ? itemIdList : [];
                this.linkControlDialog.rdp.isIndeterminate = false;
            },
            RDPItemChange(selectedItems) {
                let checkedCount = selectedItems.length;
                let itemLength = this.linkControlDialog.rdp.items.length;

                this.linkControlDialog.rdp.checkAll = checkedCount === itemLength;
                this.linkControlDialog.rdp.isIndeterminate = checkedCount > 0 && checkedCount < itemLength;
            },
            sshSelectAll(selectAll) {
                let itemIdList = [];

                for (let itemInfo of this.linkControlDialog.ssh.items) {
                    itemIdList.push(itemInfo.id);
                }
                this.linkControlDialog.ssh.checkedItems = selectAll ? itemIdList : [];
                this.linkControlDialog.ssh.isIndeterminate = false;
            },
            sshItemChange(selectedItems) {
                let checkedCount = selectedItems.length;
                let itemLength = this.linkControlDialog.ssh.items.length;

                this.linkControlDialog.ssh.checkAll = checkedCount === itemLength;
                this.linkControlDialog.ssh.isIndeterminate = checkedCount > 0 && checkedCount < itemLength;
            },
            submitLinkControlInfo() {
                // Call API
                this.common.notification('success', '更新连接控制设置成功');
                this.linkControlDialog.visible = false;
            },
            cancelLinkControlDialog() {
                this.$refs['linkControlDialog'].resetFields();
                this.linkControlDialog.visible = false;
            },
            // link control end

            // disabled ops policies start
            confirmDisabledPolicies(idList) {
                if (idList && idList[0]) {
                    this.$confirm(`确认"禁用"选中的 <span class="text-bold">${idList.length}个</span> 运维策略`, '禁用', {
                        dangerouslyUseHTMLString: true,
                        closeOnClickModal: false,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        cancelButtonClass: 'btn-cancel',
                        type: 'warning'
                    }).then(() =>{
                        this.disableOpsPolicies(idList);
                    });
                }
            },
            disableOpsPolicies(idList) {
                //call API
                this.getAuthList();
                this.common.notification('success', '禁用运维策略成功');
            },
            // disabled ops policies end

            // enabled ops policies start
            confirmEnabledPolicies(idList) {
                if (idList && idList[0]) {
                    this.$confirm(`确认"解禁"选中的 <span class="text-bold">${idList.length}个</span> 运维策略`, '解禁', {
                        dangerouslyUseHTMLString: true,
                        closeOnClickModal: false,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        cancelButtonClass: 'btn-cancel',
                        type: 'warning'
                    }).then(() =>{
                        this.enableOpsPolicies(idList);
                    });
                }
            },
            enableOpsPolicies(idList) {
                //call API
                this.getAuthList();
                this.common.notification('success', '解禁运维策略成功');
            },
            // enabled ops policies end

            // delete ops policies start
            initDeleteOpsPolicies(idList) {
                this.deleteOpsPoliciesDialog = {
                    visible: true,
                    idList: idList,
                }
            },
            deletePolicies() {
                // call API
                this.deleteOpsPoliciesDialog.visible = false;
                this.filter.pageNation.pageNo = 1;
                this.getAuthList();
                this.common.notification('success', '删除运维策略成功');
            },
            // delete ops policies end
        },
        created() {
            this.initPageInfo();
        },
        mounted() {
            this.rowDrop();
            this.$refs.toolbar.fixToolBarInit(100);
        },
        beforeDestroy() {
            this.$refs.toolbar.removeFixToolBar();
        }
    }
</script>

<style lang="scss" scoped>
#userGroupDetails {
    div#link-control{
        div.checkbox-block{
            margin-bottom: 20px;
            :last-child{
                margin-bottom: 0;
                div.el-checkbox-group{
                    margin: 10px 0 0 25px;
                }
            }
        }
    }
}
</style>
