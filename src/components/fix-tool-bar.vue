<template>
    <div></div>
</template>

<script>
    import store from "@src/store/store";

    export default {
        name: "fix-tool-bar",
        data() {
            return{
                distance: 0,
                delayFixToolBar: {}
            }
        },
        methods: {
            fixToolBarInit(newDistance) {
                const mainContent = document.getElementById('mainContent');

                this.distance = newDistance;
                mainContent.addEventListener('scroll', this.fixToolBar);
            },
            removeFixToolBar() {
                const mainContent = document.getElementById('mainContent');

                mainContent.removeEventListener('scroll', this.fixToolBar);
            },
            fixToolBar() {
                const mainContent = document.getElementById('mainContent');
                const distance = this.distance;

                this.delayFixToolBar = setTimeout(function () {
                    let fixToolBar = distance - mainContent.scrollTop < 0;

                    clearTimeout(this.delayFixToolBar);
                    store.commit('common/updateFixToolBar', fixToolBar);
                }, 50)
            }
        }
    }
</script>

<style scoped>

</style>
