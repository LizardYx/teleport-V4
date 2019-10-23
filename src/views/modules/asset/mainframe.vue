<template>
    <div id="mainframe">
        <el-breadcrumb id="pageTitle" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>主机管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="pageContent">
            <el-row :gutter="20" class="tool-bar">
                <el-col :span="18">
                    <el-button size="mini" type="primary">
                        <i class="el-icon-circle-plus-outline"></i>
                        添加主机
                    </el-button>
                    <el-button size="mini" type="primary">
                        <i class="el-icon-circle-plus-outline"></i>
                        导入主机和账号
                    </el-button>
                    <el-button size="mini" type="primary">
                        <i class="el-icon-remove"></i>
                        禁用
                    </el-button>
                    <el-button size="mini" type="primary">
                        <i class="el-icon-success"></i>
                        解禁
                    </el-button>
                    <el-button size="mini" type="primary">
                        <i class="el-icon-delete"></i>
                        删除
                    </el-button>
                    <el-button size="mini" type="primary">
                        <i class="el-icon-refresh"></i>
                        刷新列表
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <el-input :class="{'search': true, 'searching': !!searchValue}" prefix-icon="el-icon-search" size="mini" v-model="searchValue"
                              placeholder="搜索：主机IP/名称/描述/资产编号" maxlength="50">
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="tableData" border @selection-change="updateSelected">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column prop="name" sortable label="主机名称"></el-table-column>
                <el-table-column prop="ip" label="IP地址"></el-table-column>
                <el-table-column prop="os_type" sortable label="操作系统"></el-table-column>
                <el-table-column prop="cid" sortable label="资产编号"></el-table-column>
                <el-table-column prop="acc_count" label="账号数"></el-table-column>
                <el-table-column prop="state" sortable label="状态"></el-table-column>
                <el-table-column label="操作"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'mainframe',
      data() {
          return {
              searchValue: '',
              selectedIdList: [],
              tableData: [{
                  _id: 1,
                  acc_count: 0,
                  cid: '111',
                  desc: 'this is for test',
                  id: 1,
                  ip: "10.0.0.1",
                  name: "test",
                  os_type: 1,
                  os_ver: "",
                  router_ip: "",
                  router_port: 0,
                  state: 1,
                  type: 1,
              },{
                  _id: 2,
                  acc_count: 0,
                  cid: '1112',
                  desc: 'this is for test',
                  id: 1,
                  ip: "10.0.0.1",
                  name: "test22",
                  os_type: 2,
                  os_ver: "",
                  router_ip: "",
                  router_port: 0,
                  state: 2,
                  type: 1,
              }]
          }
      },
      methods: {
          updateSelected(selectedItemList) {
              let selectedIdList = [];

              selectedItemList.forEach(function (selectedItemObj) {
                  selectedIdList.push(selectedItemObj['_id']);
              });
              this.selectedIdList = selectedIdList;
          }
      }
  };
</script>

<style lang="scss" scoped>

</style>
