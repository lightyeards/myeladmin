<template>
  <el-color-picker
    v-model="theme"
    :predefine="['#409EFF', '#1890ff', '#304156','#212121','#11a983', '#13c2c2', '#6959CD', '#f5222d']"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
  />
</template>

<script>
import { useSettingsStore } from '@/store'
import Cookies from 'js-cookie'

const ORIGINAL_THEME = '#409EFF' // default color

export default {
  data() {
    return {
      theme: ''
    }
  },
  computed: {
    defaultTheme() {
      return useSettingsStore().theme
    }
  },
  watch: {
    defaultTheme: {
      handler: function(val) {
        this.theme = val
      },
      immediate: true
    },
    theme(val) {
      Cookies.set('theme', val, { expires: 365 })
      if (typeof val !== 'string') return
      this.applyTheme(val)
      this.$emit('change', val)
    }
  },
  mounted() {
    if (this.theme) {
      this.applyTheme(this.theme)
    }
  },
  methods: {
    applyTheme(color) {
      const el = document.documentElement
      el.style.setProperty('--el-color-primary', color)
      const cluster = this.getThemeCluster(color.replace('#', ''))
      // Light shades 1..9 used by Element Plus components for hover/active states
      cluster.slice(1, 10).forEach((shade, idx) => {
        el.style.setProperty(`--el-color-primary-light-${idx + 1}`, shade)
      })
      // Dark shade
      el.style.setProperty('--el-color-primary-dark-2', cluster[cluster.length - 1])
    },
    resetTheme() {
      this.applyTheme(ORIGINAL_THEME)
    },
    getThemeCluster(theme) {
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        if (tint === 0) {
          return [red, green, blue].join(',')
        } else {
          red += Math.round(tint * (255 - red))
          green += Math.round(tint * (255 - green))
          blue += Math.round(tint * (255 - blue))

          red = red.toString(16).padStart(2, '0')
          green = green.toString(16).padStart(2, '0')
          blue = blue.toString(16).padStart(2, '0')

          return `#${red}${green}${blue}`
        }
      }

      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        red = Math.round((1 - shade) * red)
        green = Math.round((1 - shade) * green)
        blue = Math.round((1 - shade) * blue)

        red = red.toString(16).padStart(2, '0')
        green = green.toString(16).padStart(2, '0')
        blue = blue.toString(16).padStart(2, '0')

        return `#${red}${green}${blue}`
      }

      const clusters = [theme]
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
      }
      clusters.push(shadeColor(theme, 0.1))
      return clusters
    }
  }
}
</script>

<style>
.theme-message,
.theme-picker-dropdown {
  z-index: 99999 !important;
}

.theme-picker .el-color-picker__trigger {
  height: 26px !important;
  width: 26px !important;
  padding: 2px;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
