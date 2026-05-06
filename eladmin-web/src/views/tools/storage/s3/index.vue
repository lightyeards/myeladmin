<template>
  <div class="app-container" style="padding: 8px;">
    <!--表单组件-->
    <eForm ref="form" />
    <!-- 工具栏 -->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.key" clearable placeholder="输入文件名称搜索" style="width: 200px;" class="filter-item" @keyup.enter="crud.toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission">
        <template #left>
          <!-- 上传 -->
          <el-button class="filter-item" type="primary" :icon="Upload" @click="dialog = true">上传</el-button>
        </template>
      </crudOperation>
      <!-- 文件上传 -->
      <el-dialog v-model="dialog" :close-on-click-modal="false" append-to-body width="520px" @close="doSubmit">
        <el-upload
          :before-remove="handleBeforeRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList"
          :headers="headers"
          :action="s3UploadApi"
          class="upload-demo"
          multiple
        >
          <el-button type="primary">点击上传</el-button>
          <template #tip><div style="display: block;" class="el-upload__tip">请勿上传违法文件，且文件不超过15M</div></template>
        </el-upload>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="doSubmit">确认</el-button>
          </div>
        </template>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="fileName" :show-overflow-tooltip="true" label="文件名">
          <template #default="scope">
            <a href="JavaScript:" class="el-link el-link--primary" target="_blank" type="primary" @click="download(scope.row.id)">{{ scope.row.fileName }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="fileRealName" width="350" label="真实文件名称" />
        <el-table-column :show-overflow-tooltip="true" prop="fileType" label="文件类型" @selection-change="crud.selectionChangeHandler" />
        <el-table-column prop="fileSize" label="文件大小" />
        <el-table-column prop="updateTime" label="创建日期" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import s3Storage from '@/api/tools/s3Storage'
import { mapState } from 'pinia'
import { markRaw } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useApiStore } from '@/store'
import { getToken } from '@/utils/auth'
import CRUD, { presenter, header, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'

export default {
  components: { pagination, crudOperation, rrOperation, DateRangePicker, Upload },
  cruds() {
    return CRUD({ title: '对象存储', url: 'api/s3Storage', crudMethod: { ...s3Storage }})
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      Upload: markRaw(Upload),
      permission: {
        del: ['admin', 'storage:del']
      },
      title: '文件', dialog: false,
      icon: 'el-icon-refresh',
      url: '', headers: { 'Authorization': getToken() },
      dialogImageUrl: '', dialogVisible: false, fileList: [], files: [], newWin: null
    }
  },
  computed: {
    ...mapState(useApiStore, [
      's3UploadApi'
    ])
  },
  watch: {
    url(newVal, oldVal) {
      if (newVal && this.newWin) {
        this.newWin.sessionStorage.clear()
        this.newWin.location.href = newVal
        // 重定向后把url和newWin重置
        this.url = ''
        this.newWin = null
      }
    }
  },
  created() {
    this.crud.optShow.add = false
    this.crud.optShow.edit = false
  },
  methods: {
    handleSuccess(response, file, fileList) {
      const uid = file.uid
      const id = response.id
      this.files.push({ uid, id })
    },
    handleBeforeRemove(file, fileList) {
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].uid === file.uid) {
          s3Storage.del([this.files[i].id]).then(res => {})
          return true
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 刷新列表数据
    doSubmit() {
      this.fileList = []
      this.dialogVisible = false
      this.dialogImageUrl = ''
      this.dialog = false
      this.crud.toQuery()
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.crud.notify(msg.message, CRUD.NOTIFICATION_TYPE.ERROR)
    },
    // 下载文件
    download(id) {
      this.downloadLoading = true
      // 先打开一个空的新窗口，再请求
      this.newWin = window.open()
      s3Storage.download(id).then(res => {
        this.downloadLoading = false
        this.url = res.url
      }).catch(err => {
        this.downloadLoading = false
        console.log(err.response.data.message)
      })
    },
    // 同步数据
    synchronize() {
      this.icon = 'el-icon-loading'
      s3Storage.sync().then(res => {
        this.icon = 'el-icon-refresh'
        ElMessage({
          showClose: true,
          message: '数据同步成功',
          type: 'success',
          duration: 1500
        })
        this.crud.toQuery()
      }).catch(err => {
        this.icon = 'el-icon-refresh'
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
