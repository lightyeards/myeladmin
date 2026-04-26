import { reactive } from 'vue'
import Dict from './Dict'

const install = function(app) {
  app.mixin({
    data() {
      if (this.$options.dicts instanceof Array) {
        return {
          dict: reactive({
            dict: {},
            label: {}
          })
        }
      }
      return {}
    },
    created() {
      if (this.$options.dicts instanceof Array) {
        new Dict(this.dict).init(this.$options.dicts, () => {
          this.$nextTick(() => {
            this.$emit('dictReady')
          })
        })
      }
    }
  })
}

export default { install }
