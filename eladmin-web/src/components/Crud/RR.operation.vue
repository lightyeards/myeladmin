<!--搜索与重置-->
<template>
  <span>
    <el-button class="filter-item" type="success" :icon="Search" @click="crud.toQuery">搜索</el-button>
    <el-button v-if="crud.optShow.reset" class="filter-item" type="warning" :icon="RefreshLeft" @click="crud.resetQuery()">重置</el-button>
  </span>
</template>
<script>
import { markRaw } from 'vue'
import { Search, RefreshLeft } from '@element-plus/icons-vue'
import { crud } from '@crud/crud'
export default {
  mixins: [crud()],
  data() {
    return { Search: markRaw(Search), RefreshLeft: markRaw(RefreshLeft) }
  },
  props: {
    itemClass: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>
