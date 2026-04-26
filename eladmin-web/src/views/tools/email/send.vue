<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="100px">
      <el-form-item label="邮件标题" prop="subject">
        <el-input v-model="form.subject" style="width: 646px" placeholder="请输入邮件标题，标题不能为空" />
      </el-form-item>
      <el-form-item label="收件地址" prop="tos">
        <el-input v-model="form.tos" style="width: 646px" placeholder="请输入收件地址，多个地址英文逗号,隔开" />
      </el-form-item>
      <wang-editor v-model="form.content" :editor-height="360" />
      <el-button :loading="loading" style="margin-left:1.6%;margin-bottom: 30px" size="default" type="primary" @click="doSubmit">发送邮件</el-button>
    </el-form>
  </div>
</template>

<script>
import { ElNotification } from 'element-plus'
import { mapState } from 'pinia'
import { useApiStore } from '@/store'
import { send } from '@/api/tools/email'
import WangEditor from '@/components/WangEditor/index.vue'
export default {
  name: 'Index',
  components: { WangEditor },
  data() {
    return {
      loading: false, form: { subject: '', tos: '', content: '' },
      rules: {
        subject: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        tos: [
          { required: true, message: '收件人不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState(useApiStore, ['imagesUploadApi', 'baseApi'])
  },
  methods: {
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          send(this.form).then(res => {
            ElNotification({
              title: '发送成功',
              type: 'success',
              duration: 2500
            })
            this.loading = false
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .editor{
    text-align:left;
    margin: 20px;
    width: 730px;
  }
</style>
