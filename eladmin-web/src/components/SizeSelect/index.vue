<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <svg-icon class-name="size-icon" icon-class="size" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="size===item.value" :command="item.value">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { ElMessage } from 'element-plus'
import { useAppStore, useTagsViewStore } from '@/store'

export default {
  data() {
    return {
      sizeOptions: [
        { label: 'Large', value: 'large' },
        { label: 'Default', value: 'default' },
        { label: 'Small', value: 'small' }
      ]
    }
  },
  computed: {
    size() {
      return useAppStore().size
    }
  },
  methods: {
    handleSetSize(size) {
      useAppStore().setSize(size)
      this.refreshView()
      ElMessage({
        message: '布局设置成功',
        type: 'success'
      })
    },
    refreshView() {
      // In order to make the cached page re-rendered
      useTagsViewStore().delAllCachedViews(this.$route)

      const { fullPath } = this.$route

      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    }
  }
}
</script>
