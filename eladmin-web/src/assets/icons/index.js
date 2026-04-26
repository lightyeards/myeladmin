import SvgIcon from '@/components/SvgIcon/index.vue'// svg component
import 'virtual:svg-icons-register'

export default function registerSvgIcon(app) {
  app.component('SvgIcon', SvgIcon)
}
