<template>
    <div id="copyRight">
        TELEPORT v3.3.0 | ©2019 - 2020
        <a href="http://www.tp4a.com" target="_blank">TP4A</a>
        {{$t('i18n., 保留所有权')}}
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
        height: 40px;
        line-height: 40px;
        font-size: $basic-size;
        text-align: center;
        color: $text-basic;
    }
</style>
