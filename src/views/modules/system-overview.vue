<template>
    <div id="systemOverview">
        <el-breadcrumb id="pageTitle" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>系统总览</el-breadcrumb-item>
        </el-breadcrumb>
<!--        <div class="user-basic-info">-->
<!--            <el-row :gutter="15">-->
<!--                <el-col :span="8">-->
<!--                    <div class="user-block">-->
<!--                        <div class="user-header">-->
<!--                            <div class="name">-->
<!--                                叶欣（）-->
<!--                            </div>-->
<!--                        </div>-->
<!--                        <div class="user-content"></div>-->
<!--                    </div>-->
<!--                </el-col>-->
<!--                <el-col :span="16">-->
<!--                    <div></div>-->
<!--                </el-col>-->
<!--            </el-row>-->
<!--        </div>-->
        <div class="serve-basic-info">
            <el-row :gutter="15">
                <el-col :span="8">
                    <div class="basic-block user-block">
                        <i class="el-icon-user"></i>
                        <div class="block-detail">
                            <div class="detail-info">
                                <a>
                                    <span class="number">1</span>
                                    <span class="unit">个</span>
                                </a>
                            </div>
                            <div>用户</div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="basic-block host-block">
                        <i class="el-icon-monitor"></i>
                        <div class="block-detail">
                            <div class="detail-info">
                                <a>
                                    <span class="number">1</span>
                                    <span class="unit">台</span>
                                </a>
                            </div>
                            <div>主机</div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="basic-block account-block">
                        <i class="el-icon-s-custom"></i>
                        <div class="block-detail">
                            <div class="detail-info">
                                <a>
                                    <span class="number">1</span>
                                    <span class="unit">个</span>
                                </a>
                            </div>
                            <div>主机账号</div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'systemOverview',
      data() {
        return {}
      },
      methods: {

      }
  };
</script>

<style lang="scss" scoped>
    #systemOverview{
        .user-basic-info{
            .user-block{
                .user-header{
                    background-color: $color-main;
                    height: 135px;
                    text-align: center;
                }
            }
        }
        .serve-basic-info{
            .basic-block{
                color: #fff;
                padding: 30px;
                i{
                    font-size:75px;
                    margin-right: 30px;
                }
                .block-detail{
                    display: inline-block;
                    .detail-info{
                        font-weight: bold;
                        margin-bottom: 10px;
                        a{
                            color: #fff;
                            span.number{
                                font-size: 40px;
                            }
                            span.unit{
                                position: relative;
                                top: -3px;
                                font-size: 25px;
                            }
                        }
                    }
                }
            }
            .user-block{
                background-color: #1abc9c;
            }
            .host-block{
                background-color: $color-main;
            }
            .account-block{
                background-color: $color-success;
            }
        }
    }
</style>
