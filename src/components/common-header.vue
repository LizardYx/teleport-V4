<template>
    <div id="header">
        <router-link :to="{name: isLogin ? 'modules-main' : 'login'}">
            <img class="logo" src="../assets/img/logo.png" alt="Teleport">
        </router-link>
        <i v-bind:class="{'el-icon-s-unfold': isCollapse, 'el-icon-s-fold': !isCollapse}"></i>
    </div>
</template>

<script>
    import store from "../store/store";

    export default {
        name: 'common-header',
        data() {
            return {

            };
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
            updateCollapse(collapse) {
                store.commit('common/updateCollapse', collapse);
            }
        }
    };
</script>

<style lang="scss" scoped>
    #header{
        img{
            color: #fff;
        }
    }
</style>
