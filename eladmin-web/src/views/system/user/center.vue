<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
        <el-card class="box-card">
          <template #header>
            <div class="clearfix">
              <span>个人信息</span>
            </div>
          </template>
          <div>
            <div style="text-align: center">
              <div class="el-upload">
                <img :src="user.avatarName ? baseApi + '/avatar/' + user.avatarName : Avatar" title="点击上传头像" class="avatar" @click="toggleShow">
                <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="handleFileChange">
              </div>
            </div>
            <ul class="user-info">
              <li><div style="height: 100%"><svg-icon icon-class="login" /> 登录账号<div class="user-right">{{ user.username }}</div></div></li>
              <li><svg-icon icon-class="user1" /> 用户昵称 <div class="user-right">{{ user.nickName }}</div></li>
              <li><svg-icon icon-class="dept" /> 所属部门 <div class="user-right"> {{ user.dept.name }}</div></li>
              <li><svg-icon icon-class="phone" /> 手机号码 <div class="user-right">{{ user.phone }}</div></li>
              <li><svg-icon icon-class="email" /> 用户邮箱 <div class="user-right">{{ user.email }}</div></li>
              <li>
                <svg-icon icon-class="anq" /> 安全设置
                <div class="user-right">
                  <a @click="$refs.pass.dialog = true">修改密码</a>
                  <a @click="$refs.email.dialog = true">修改邮箱</a>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <!--    用户资料    -->
        <el-card class="box-card">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户资料" name="first">
              <el-form ref="form" :model="form" :rules="rules" style="margin-top: 10px;" label-width="65px">
                <el-form-item label="昵称" prop="nickName">
                  <el-input v-model="form.nickName" style="width: 35%" />
                  <span style="color: #C0C0C0;margin-left: 10px;">用户昵称不作为登录使用</span>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="form.phone" style="width: 35%;" />
                  <span style="color: #C0C0C0;margin-left: 10px;">手机号码不能重复</span>
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio-group v-model="form.gender" style="width: 178px">
                    <el-radio value="男">男</el-radio>
                    <el-radio value="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="">
                  <el-button :loading="saveLoading" type="primary" @click="doSubmit">保存配置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <!--    操作日志    -->
            <el-tab-pane label="操作日志" name="second">
              <el-table v-loading="loading" :data="data" style="width: 100%;">
                <el-table-column prop="description" label="行为" />
                <el-table-column prop="requestIp" label="IP" />
                <el-table-column :show-overflow-tooltip="true" prop="address" label="IP来源" />
                <el-table-column prop="browser" label="浏览器" />
                <el-table-column prop="time" label="请求耗时" align="center">
                  <template #default="scope">
                    <el-tag v-if="scope.row.time <= 300">{{ scope.row.time }}ms</el-tag>
                    <el-tag v-else-if="scope.row.time <= 1000" type="warning">{{ scope.row.time }}ms</el-tag>
                    <el-tag v-else type="danger">{{ scope.row.time }}ms</el-tag>
                  </template>
                </el-table-column>
                <el-table-column align="right">
                  <template #header>
                    <div style="display:inline-block;float: right;cursor: pointer" @click="init">
                      创建日期
                      <el-icon style="margin-left: 40px"><refresh /></el-icon>
                    </div>
                  </template>
                  <template #default="scope">
                    <span>{{ scope.row.createTime }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <!--分页组件-->
              <el-pagination
                :total="total"
                :current-page="page"
                style="margin-top: 8px;"
                layout="total, prev, pager, next, sizes"
                @size-change="sizeChange"
                @current-change="pageChange"
              />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog v-model="cropVisible" title="裁剪头像" width="400px">
      <div style="height: 300px;">
        <vue-cropper
          ref="cropper"
          :img="cropOption.img"
          :output-size="cropOption.outputSize"
          :output-type="cropOption.outputType"
          :info="cropOption.info"
          :can-scale="cropOption.canScale"
          :auto-crop="cropOption.autoCrop"
          :auto-crop-width="cropOption.autoCropWidth"
          :auto-crop-height="cropOption.autoCropHeight"
          :fixed-box="cropOption.fixedBox"
          :fixed="cropOption.fixed"
          :fixed-number="cropOption.fixedNumber"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cropVisible = false">取消</el-button>
          <el-button type="primary" @click="uploadAvatar">保存</el-button>
        </span>
      </template>
    </el-dialog>
    <updateEmail ref="email" :email="user.email" />
    <updatePass ref="pass" />
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'pinia'
import { Refresh } from '@element-plus/icons-vue'
import { useUserStore, useApiStore } from '@/store'
import updatePass from './center/updatePass.vue'
import updateEmail from './center/updateEmail.vue'
import { getToken } from '@/utils/auth'
import { isvalidPhone } from '@/utils/validate'
import crud from '@/mixins/crud'
import { editUser } from '@/api/system/user'
import Avatar from '@/assets/images/avatar.png'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

export default {
  name: 'Center',
  components: { updatePass, updateEmail, Refresh, VueCropper },
  mixins: [crud],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      Avatar: Avatar,
      activeName: 'first',
      saveLoading: false,
      form: {},
      cropVisible: false,
      cropOption: {
        img: '',
        outputSize: 1,
        outputType: 'jpeg',
        info: true,
        canScale: true,
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true,
        fixed: true,
        fixedNumber: [1, 1]
      },
      rules: {
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    ...mapState(useApiStore, ['updateAvatarApi', 'baseApi'])
  },
  created() {
    this.form = { id: this.user.id, nickName: this.user.nickName, gender: this.user.gender, phone: this.user.phone }
    useUserStore().getInfo()
  },
  methods: {
    toggleShow() {
      this.$refs.fileInput.click()
    },
    handleFileChange(e) {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (e) => {
        this.cropOption.img = e.target.result
        this.cropVisible = true
      }
      reader.readAsDataURL(file)
      // 重置 input，允许重复选择同一文件
      e.target.value = ''
    },
    handleClick(tab, event) {
      if (tab.props.name === 'second') {
        this.init()
      }
    },
    beforeInit() {
      this.url = 'api/logs/user'
      return true
    },
    uploadAvatar() {
      this.$refs.cropper.getCropBlob(blob => {
        const data = new FormData()
        data.append('avatar', blob, 'avatar.jpg')
        const config = {
          headers: { 'Authorization': getToken() }
        }
        axios.post(this.updateAvatarApi, data, config).then(() => {
          this.cropVisible = false
          this.cropUploadSuccess()
        }).catch(err => {
          console.error(err)
        })
      })
    },
    cropUploadSuccess() {
      useUserStore().getInfo()
    },
    doSubmit() {
      if (this.$refs['form']) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            editUser(this.form).then(() => {
              this.editSuccessNotify()
              useUserStore().getInfo()
              this.saveLoading = false
            }).catch(() => {
              this.saveLoading = false
            })
          }
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  .user-info {
    padding-left: 0;
    list-style: none;
    li{
      border-bottom: 1px solid #F0F3F4;
      padding: 11px 0;
      font-size: 13px;
    }
    .user-right {
      float: right;
      a{
        color: #317EF3;
      }
    }
  }
</style>
