<template>
  <div ref="editor" style="border: 1px solid #ccc;">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :default-config="toolbarConfig"
      :mode="editMode"
    />
    <Editor
      v-model="editValue"
      :style="{'height': editorHeight +'px', 'overflow-y': 'hidden'}"
      :default-config="editorConfig"
      :mode="editMode"
      @on-created="onCreated"
    />
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useApiStore } from '@/store'
import { upload } from '@/utils/upload'
import { Toolbar, Editor } from '@wangeditor/editor-for-vue'

export default {
  name: 'WangEditor',
  components: { Toolbar, Editor },
  props: {
    modelValue: {
      type: String,
      required: false,
      default: ''
    },
    editorHeight: {
      type: Number,
      required: false,
      default: 420
    }
  },
  emits: ['update:modelValue'],
  data() {
    const _this = this
    return {
      toolbarConfig: {},
      editorConfig: { placeholder: '请输入内容...', MENU_CONF: {
        'uploadImage': {
          // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
          allowedFileTypes: ['image/*'],
          // 自定义上传
          async customUpload(file, insertFn) { // JS 语法
            upload(_this.imagesUploadApi, file).then(res => {
              const data = res.data
              const url = _this.baseApi + '/file/' + data.type + '/' + data.realName
              // 最后插入图片
              insertFn(url, '', '')
            })
          }
        }
      }},
      editMode: 'simple',
      editor: null,
      editValue: ''
    }
  },
  computed: {
    ...mapState(useApiStore, ['imagesUploadApi', 'baseApi'])
  },
  watch: {
    editValue(newVal) {
      this.$emit('update:modelValue', newVal)
    },
    modelValue(newVal) {
      if (newVal !== this.editValue) {
        this.editValue = newVal
      }
    }
  },
  beforeUnmount() {
    if (this.editor) {
      this.editor.destroy()
      this.editor = null
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = editor
      this.editValue = this.modelValue
    }
  }
}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style scoped>
.text {
  text-align:left;
}
:deep(.w-e-text-container) {
  height: 420px !important;
}
</style>
