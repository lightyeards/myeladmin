import { createApp } from 'vue'
import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'
import '@/utils/echarts'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 数据字典
import dict from './components/Dict'

// 权限指令
import checkPer from '@/utils/permission'
import permission from './components/Permission'
import './assets/styles/element-variables.scss'

// global css
import './assets/styles/index.scss'

import App from './App.vue'
import pinia from './store'
import router from './router/routers'

import registerSvgIcon from './assets/icons' // icon
import './permission' // permission control / route guard

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  size: Cookies.get('size') || 'default',
  locale: zhCn
})

// 注册 Element Plus 全部图标组件
for (const [iconName, iconComponent] of Object.entries(ElementPlusIconsVue)) {
  app.component(iconName, iconComponent)
}

app.use(permission)
app.use(dict)
registerSvgIcon(app)

app.config.globalProperties.checkPer = checkPer
app.config.productionTip = false

app.mount('#app')
