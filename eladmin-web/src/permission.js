import router from './router/routers'
import Config from '@/settings'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import { buildMenus } from '@/api/system/menu'
import { useUserStore, usePermissionStore } from '@/store'
import { filterAsyncRouter } from '@/store/modules/permission'

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login']// no redirect whitelist

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Config.title
  }
  NProgress.start()
  if (getToken()) {
    const userStore = useUserStore()
    // 已登录且要跳转的页面是登录页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (userStore.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        userStore.getInfo().then(() => { // 拉取user_info
          // 动态路由，拉取菜单
          loadMenus(next, to)
        }).catch(() => {
          userStore.logOut().then(() => {
            location.reload() // 为了重新实例化 router 对象 避免 bug
          })
        })
      // 登录时未拉取 菜单，在此处拉取
      } else if (userStore.loadMenus) {
        // 修改成false，防止死循环
        userStore.updateLoadMenus()
        loadMenus(next, to)
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

export const loadMenus = (next, to) => {
  buildMenus().then(res => {
    const sdata = JSON.parse(JSON.stringify(res))
    const rdata = JSON.parse(JSON.stringify(res))
    const sidebarRoutes = filterAsyncRouter(sdata)
    const rewriteRoutes = filterAsyncRouter(rdata, false, true)
    rewriteRoutes.push({ path: '/:pathMatch(.*)*', redirect: '/404', hidden: true })

    const permissionStore = usePermissionStore()
    permissionStore.generateRoutes(rewriteRoutes)
    rewriteRoutes.forEach(r => router.addRoute(r))
    next({ ...to, replace: true })
    permissionStore.setSidebarRouters(sidebarRoutes)
  })
}

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
