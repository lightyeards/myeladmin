import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// 重新导出所有 stores 方便统一引入
export { useUserStore } from './modules/user'
export { useAppStore } from './modules/app'
export { useSettingsStore } from './modules/settings'
export { useTagsViewStore } from './modules/tagsView'
export { useApiStore } from './modules/api'
export { usePermissionStore } from './modules/permission'
