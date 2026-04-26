import { defineStore } from 'pinia'
import { constantRouterMap } from '@/router/routers'
import Layout from '@/layout/index.vue'
import ParentView from '@/components/ParentView.vue'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routers: constantRouterMap,
    addRouters: [],
    sidebarRouters: []
  }),

  actions: {
    generateRoutes(asyncRouter) {
      this.addRouters = asyncRouter
      this.routers = constantRouterMap.concat(asyncRouter)
    },
    setSidebarRouters(sidebarRouter) {
      this.sidebarRouters = constantRouterMap.concat(sidebarRouter)
    }
  }
})

export const filterAsyncRouter = (routers, lastRouter = false, type = false) => { // 遍历后台传来的路由字符串，转换为组件对象
  return routers.filter(router => {
    if (type && router.children) {
      router.children = filterChildren(router.children)
    }
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else if (router.component === 'ParentView') {
        router.component = ParentView
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router.children != null && router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children, router, type)
    } else {
      delete router['children']
      delete router['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

// Vite 需要静态分析动态 import，预先收集所有候选 view
const viewModules = import.meta.glob('@/views/**/*.vue')

export const loadView = (view) => {
  const target = `/src/views/${view}.vue`
  if (viewModules[target]) {
    return viewModules[target]
  }
  // 兼容相对路径写法
  const alt = Object.keys(viewModules).find((k) => k.endsWith(`/views/${view}.vue`))
  if (alt) {
    return viewModules[alt]
  }

  console.error(`[loadView] 未找到视图: ${view}`)
  return null
}
