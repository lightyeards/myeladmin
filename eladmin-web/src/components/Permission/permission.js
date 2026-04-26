import { useUserStore } from '@/store'

// Vue 3 directive — `inserted` → `mounted`
export default {
  mounted(el, binding) {
    const { value } = binding
    const userStore = useUserStore()
    const roles = userStore.roles
    if (value && value instanceof Array) {
      if (value.length > 0) {
        const permissionRoles = value
        const hasPermission = roles.some(role => permissionRoles.includes(role))
        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      }
    } else {
      throw new Error(`使用方式： v-permission="['admin','editor']"`)
    }
  }
}
