<template>
    <div id="header" class="pad-hor" v-bind:class="{'has-login basic-box-shadow': isLogin}">
        <router-link class="logo" :to="{path: isLogin ? '/modules-main/system-overview' : '/'}">
            <img src="../assets/img/logo.png" alt="Teleport">
        </router-link>
        <div class="header-right">
            <i v-if="isLogin" class="collapse-icon" v-bind:class="{'el-icon-s-unfold': isCollapse, 'el-icon-s-fold': !isCollapse}"
               @click="updateCollapse">
            </i>
        </div>
    </div>
</template>

<script>
    import store from "../store/store";

    export default {
        name: 'common-header',
        data() {
            return {};
        },
        computed: {
            isLogin: function () {
                return store.state.common.isLogin;
            },
            isCollapse: function () {
                return store.state.common.isCollapse;
            }
        },
        methods: {
            updateCollapse() {
                store.commit('common/updateCollapse', !this.isCollapse);
            }
        }
    };
</script>

<style lang="scss" scoped>
    #header{
        height: 60px;
        .logo{
            float: left;
            img{
                color: #fff;
            }
        }
        .header-right{
            margin-left: 215px;
            height: 100%;
            .collapse-icon{
                font-size: 30px;
                color: #66696F;
                margin-top: 15px;
                cursor: pointer;
            }
        }
    }
    .has-login{
        .logo{
            img{
                height: 50px;
                padding: 5px 0;
            }
        }
    }
</style>
