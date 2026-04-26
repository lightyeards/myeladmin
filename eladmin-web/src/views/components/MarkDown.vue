<template>
  <div class="app-container">
    <p class="warn-content">
      Markdown 基于
      <el-link type="primary" href="https://github.com/imzbf/md-editor-v3" target="_blank">md-editor-v3</el-link>
    </p>
    <MdEditor v-model="text" :style="{ height: height }" @on-upload-img="onUploadImg" />
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useApiStore } from '@/store'
import { upload } from '@/utils/upload'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

export default {
  name: 'Markdown',
  components: {
    MdEditor
  },
  data() {
    return {
      text: '更多帮助请查看官方文档',
      height: document.documentElement.clientHeight - 200 + 'px'
    }
  },
  computed: {
    ...mapState(useApiStore, ['imagesUploadApi', 'baseApi'])
  },
  mounted() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 200 + 'px'
    }
  },
  methods: {
    async onUploadImg(files, callback) {
      const res = await Promise.all(
        files.map(file => upload(this.imagesUploadApi, file))
      )
      const urls = res.map(item => {
        const data = item.data
        return this.baseApi + '/file/' + data.type + '/' + data.realName
      })
      callback(urls)
    }
  }
}
</script>

<style scoped>
  .md-editor {
    z-index: 5;
  }
</style>
