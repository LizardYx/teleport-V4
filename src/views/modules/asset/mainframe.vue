<template>
    <div id="mainframe">
        <el-breadcrumb id="pageTitle" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>主机管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-content">
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
                    <el-input class="search" prefix-icon="el-icon-search" size="mini" v-model="searchValue"
                              placeholder="搜索：主机IP/名称/描述/资产编号" maxlength="50">
                    </el-input>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'mainframe',
      data() {
          return {
              searchValue: ''
          }
      },
      methods: {

      }
  };
</script>

<style lang="scss" scoped>

</style>
