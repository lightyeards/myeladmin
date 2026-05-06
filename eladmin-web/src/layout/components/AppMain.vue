<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="key" />
        </keep-alive>
      </transition>
    </router-view>
    <el-backtop :bottom="50" :right="40"><el-icon><caret-top /></el-icon></el-backtop>
    <div v-if="showFooter" id="el-main-footer">
      <span v-html="footerTxt" />
      <span v-if="caseNumber"> ⋅ </span>
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">{{ caseNumber }}</a>
    </div>
  </section>
</template>

<script>
import { CaretTop } from '@element-plus/icons-vue'
import { mapState } from 'pinia'
import { useTagsViewStore, useSettingsStore } from '@/store'
export default {
  name: 'AppMain',
  components: { CaretTop },
  computed: {
    ...mapState(useTagsViewStore, ['cachedViews']),
    ...mapState(useSettingsStore, ['showFooter', 'footerTxt', 'caseNumber']),
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
