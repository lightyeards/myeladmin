<!--搜索与重置-->
<template>
  <span>
    <el-button class="filter-item" size="small" type="success" :icon="Search" @click="crud.toQuery">搜索</el-button>
    <el-button v-if="crud.optShow.reset" class="filter-item" size="small" type="warning" :icon="RefreshLeft" @click="crud.resetQuery()">重置</el-button>
  </span>
</template>
<script>
import { Search, RefreshLeft } from '@element-plus/icons-vue'
import { crud } from '@crud/crud'
export default {
  mixins: [crud()],
  components: { Search, RefreshLeft },
  props: {
    itemClass: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>
