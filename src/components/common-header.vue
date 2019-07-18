<template>
    <div id="header">
        <router-link :to="{name: this.$store.state.isLogin ? 'modules-main' : 'login'}">
            <img class="logo" src="../assets/img/logo.png" alt="Teleport">
        </router-link>
    </div>
</template>

<script>
    export default {
        name: 'common-header',
        data() {
            return {};
        },
        methods() {

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
