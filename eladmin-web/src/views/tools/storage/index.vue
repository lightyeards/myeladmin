<template>
  <el-tabs v-model="activeName" style="padding-left: 8px;" @tab-click="tabClick">
    <el-tab-pane label="本地存储" name="first">
      <Local ref="local" />
    </el-tab-pane>
    <el-tab-pane label="对象存储" name="second">
      <template #label>
        对象存储
        <el-tooltip content="兼容 Amazon S3 协议的对象存储，暂不提供测试，请自行运行测试" placement="top">
          <el-icon style="margin-left: 8px; cursor: pointer;"><question-filled /></el-icon>
        </el-tooltip>
      </template>
      <S3 ref="s3" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { QuestionFilled } from '@element-plus/icons-vue'
import S3 from './s3/index.vue'
import Local from './local/index.vue'
export default {
  name: 'Storage',
  components: { S3, Local, QuestionFilled },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    tabClick(name) {
      if (this.activeName === 'first') {
        this.$refs.local.crud.toQuery()
      } else {
        this.$refs.s3.crud.toQuery()
      }
    }
  }
}
</script>

<style scoped>
/* 自定义问号图标样式 */
.question-icon {
  font-size: 16px;
  color: #409EFF;
}
</style>
