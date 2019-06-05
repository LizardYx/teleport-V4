<template>
    <div id="header">
        <router-link :to="{name: 'login'}">
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
    };
</script>

<style scoped>
    #header{
        position: fixed;
    }

    #header img{
        color: #fff;
    }
</style>
