<template>
    <div id="header">
        <router-link :to="{name: 'Login'}">
            <img class="logo" src="../assets/header/logo.png" alt="Teleport">
        </router-link>
    </div>
</template>

<script>
    export default {
        name: 'common-header',
        data() {
            return {};
        },
    };
</script>

<style scoped>
    #header{
        position: fixed;
        padding: 15px;
    }

    #header img{
        color: #fff;
    }
</style>
