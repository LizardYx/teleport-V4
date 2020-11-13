<template>
    <div id="userGroupDetails">
        <el-breadcrumb id="pageTitle" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>运维策略</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="pageContent">
            <el-row :gutter="20" class="tool-bar">
                <el-col :span="18">
                    <el-button size="mini" type="primary">
                        <i class="el-icon-circle-plus-outline"></i>
                        新建授权策略
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]">
                        禁用策略
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]">
                        解禁策略
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="!selectedIdList[0]">
                        <i class="el-icon-delete"></i>
                        移除策略
                    </el-button>
                    <el-button size="mini" type="primary" @click="getAuthList()">
                        <i class="el-icon-refresh"></i>
                        刷新列表
                    </el-button>
                </el-col>
                <el-col :span="6"></el-col>
            </el-row>
            <div class="mar-btm">

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
    import {asyncGet, asyncPost} from '@src/assets/axios'
    import {api} from "@src/assets/api";
    import FixToolBar from  "@src/components/fix-tool-bar"

    export default {
        name: "authorization",
        components: {FixToolBar},
        data() {
            return{
                filter: {
                    pageNation: this.common.initPageNation(),
                },
                selectedIdList: [],
                authList: [],
                statusList: this.common.statusList,
            }
        },
        methods: {
            initPageInfo() {
                this.getAuthList();
            },
            getAuthList() {

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
