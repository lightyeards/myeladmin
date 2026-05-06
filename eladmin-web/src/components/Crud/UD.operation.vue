<template>
  <div style="display: flex; gap: 6px; justify-content: center">
    <el-button v-permission="permission.edit" :loading="crud.status.cu === 2" :disabled="disabledEdit" type="primary" :icon="Edit" @click.stop="crud.toEdit(data)" />
    <span v-permission="permission.del" style="display: inline-block">
      <el-popover v-model="pop" placement="top" width="180" trigger="manual" @show="onPopoverShow" @hide="onPopoverHide">
        <template #reference>
          <el-button :disabled="disabledDle" type="danger" :icon="Delete" @click.stop="toDelete" />
        </template>
        <p>{{ msg }}</p>
        <div style="text-align: right; margin: 0">
          <el-button text @click="doCancel">取消</el-button>
          <el-button :loading="crud.getDataStatus(crud.getDataId(data)).delete === 2" type="primary" @click="crud.doDelete(data)">确定</el-button>
        </div>
      </el-popover>
    </span>
  </div>
</template>
<script>
import { markRaw } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import CRUD, { crud } from '@crud/crud'
export default {
  mixins: [crud()],
  props: {
    data: {
      type: Object,
      required: true
    },
    permission: {
      type: Object,
      required: true
    },
    disabledEdit: {
      type: Boolean,
      default: false
    },
    disabledDle: {
      type: Boolean,
      default: false
    },
    msg: {
      type: String,
      default: '确定删除本条数据吗？'
    }
  },
  data() {
    return {
      pop: false,
      Edit: markRaw(Edit),
      Delete: markRaw(Delete)
    }
  },
  methods: {
    doCancel() {
      this.pop = false
      this.crud.cancelDelete(this.data)
    },
    toDelete() {
      this.pop = true
    },
    [CRUD.HOOK.afterDelete](crud, data) {
      if (data === this.data) {
        this.pop = false
      }
    },
    onPopoverShow() {
      setTimeout(() => {
        document.addEventListener('click', this.handleDocumentClick)
      }, 0)
    },
    onPopoverHide() {
      document.removeEventListener('click', this.handleDocumentClick)
    },
    handleDocumentClick(event) {
      this.pop = false
    }
  }
}
</script>
