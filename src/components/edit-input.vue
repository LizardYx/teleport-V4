<template>
    <div class="edit-input">
        <el-popover v-if="!editInput" placement="right" trigger="hover">
            <div v-html="getDescInfo(desc)"></div>
            <el-link slot="reference" :underline="false" @click="editInput = true">
                {{name}}
                <i class="el-icon-edit el-icon--right"></i>
            </el-link>
        </el-popover>
        <div v-else>
            <el-input v-model="newName" @keyup.enter.native="updateName()" size="mini">
                <el-button slot="append" icon="el-icon-close" size="mini" @click="cancelEditInput()"></el-button>
            </el-input>
        </div>
    </div>
</template>

<script>
    export default {
        name: "edit-input",
        props: {
            id: {
                type: Number,
                required: true
            },
            name: {
                type: [String, Number],
                required: true
            },
            maxLen: {
                type: Number
            },
            desc: {
                type: String
            },
            callback: Function,
            required: true
        },
        data() {
            return{
                editInput: false,
                newName: this.name
            }
        },
        methods: {
            getDescInfo(desc) {
                let content = '';

                if (desc !== '') {
                    content = desc.replace(/\r/g, '').replace(/\n/g, '<br/>');
                }
                return content;
            },
            updateName() {
                if (this.newName !== '') {
                    this.editInput = false;
                    this.callback(this.id, this.newName);
                }else {
                    this.common.notification('warning', this.$t('i18n.组件.名称不能为空'));
                }
            },
            cancelEditInput() {
                this.newName = this.name;
                this.editInput = false;
            }
        }
    }
</script>

<style lang="scss">
    .edit-input{
        .el-input-group__append{
            button:hover{
                box-shadow: none;
            }
        }
    }
</style>
