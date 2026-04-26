import { defineStore } from 'pinia'
import variables from '@/assets/styles/element-variables.module.js'
import defaultSettings from '@/settings'

const { tagsView, fixedHeader, sidebarLogo, showFooter, footerTxt, caseNumber } = defaultSettings

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: variables.theme,
    showSettings: false,
    tagsView,
    fixedHeader,
    sidebarLogo,
    showFooter,
    footerTxt,
    caseNumber
  }),

  actions: {
    changeSetting({ key, value }) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        this[key] = value
      }
    }
  }
})
