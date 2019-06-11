<template>
    <div id="copyRight">
        TELEPORT v3.3.0 | ©2019 - 2020
        <a href="http://www.tp4a.com" target="_blank">TP4A</a>
        , 保留所有权
    </div>
</template>

<script>
    export default {
        name: 'copy-right',
        data() {
            return {}
        }
    };
</script>

<style lang="scss" scoped>
    #copyRight{
        position: fixed;
        bottom: 0;
        height: 40px;
        line-height: 40px;
        width: 100%;
        font-size: $basic-size;
        text-align: center;
        color: $text-basic;
    }
</style>
