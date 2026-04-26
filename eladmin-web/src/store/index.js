import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// Vite-native module auto-discovery
const modulesFiles = import.meta.glob('./modules/*.js', { eager: true })

const modules = Object.entries(modulesFiles).reduce((acc, [filePath, mod]) => {
  const moduleName = filePath.replace(/^\.\/modules\/(.*)\.js$/, '$1')
  acc[moduleName] = mod.default
  return acc
}, {})

const store = new Vuex.Store({
  modules,
  getters
})

export default store
