import { defineStore } from 'pinia'
import { login, getInfo, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    user: {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false
  }),

  actions: {
    setToken(token) {
      this.token = token
    },
    setUser(user) {
      this.user = user
    },
    setRoles(roles) {
      this.roles = roles
    },
    setLoadMenus(loadMenus) {
      this.loadMenus = loadMenus
    },

    // 登录
    login(userInfo) {
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid).then(res => {
          setToken(res.token, rememberMe)
          this.token = res.token
          applyUserInfo(this, res.user)
          // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
          this.loadMenus = true
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          applyUserInfo(this, res)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    logOut() {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          clearAuth(this)
          resolve()
        }).catch(error => {
          clearAuth(this)
          reject(error)
        })
      })
    },

    updateLoadMenus() {
      this.loadMenus = false
    }
  }
})

function applyUserInfo(store, res) {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.roles.length === 0) {
    store.roles = ['ROLE_SYSTEM_DEFAULT']
  } else {
    store.roles = res.roles
  }
  store.user = res.user
}

function clearAuth(store) {
  store.token = ''
  store.roles = []
  removeToken()
}
