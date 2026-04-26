<template>
  <el-dialog v-model="dialog" append-to-body :close-on-click-modal="false" title="执行脚本" width="400px">
    <el-form ref="form" :rules="rules" size="small">
      <el-upload
        :action="databaseUploadApi"
        :data="databaseInfo"
        :headers="headers"
        :on-success="handleSuccess"
        :on-error="handleError"
        class="upload-demo"
        drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">上传后，系统会自动执行SQL脚本</div>
        </template>
      </el-upload>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="cancel">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { mapState } from 'pinia'
import { ElNotification } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { useApiStore } from '@/store'
import { getToken } from '@/utils/auth'
export default {
  components: { UploadFilled },
  props: {
    databaseInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      headers: {
        Authorization: getToken()
      },
      rules: {}
    }
  },
  computed: {
    ...mapState(useApiStore, ['databaseUploadApi'])
  },
  mounted() {
  },
  methods: {
    cancel() {
      this.dialog = false
    },
    handleSuccess(response, file, fileList) {
      if (response === 'success') {
        ElNotification({
          title: '执行成功',
          type: 'success',
          duration: 2500
        })
      } else {
        ElNotification({
          title: response,
          type: 'error',
          duration: 0
        })
      }
    },
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      ElNotification({
        title: msg.message,
        type: 'error',
        duration: 0
      })
    }
  }
}
</script>

<style scoped>
</style>
