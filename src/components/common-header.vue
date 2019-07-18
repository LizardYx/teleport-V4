<template>
    <div id="header">
        <router-link :to="{name: isLogin ? 'modules-main' : 'login'}">
            <img class="logo" src="../assets/img/logo.png" alt="Teleport">
        </router-link>
        <i v-if="isLogin" class="collapse-icon" v-bind:class="{'el-icon-s-unfold': isCollapse, 'el-icon-s-fold': !isCollapse}"
           @click="updateCollapse">
        </i>
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
            updateCollapse() {
                store.commit('common/updateCollapse', !this.isCollapse);
            }
        }
    };
</script>

<style lang="scss" scoped>
    #header{
        img{
            color: #fff;
        }
        .collapse-icon{
            font-size: 30px;
            color: $text-basic;
        }
    }
</style>
