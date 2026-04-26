<template>
  <span class="menu-item-content">
    <svg-icon v-if="icon" :icon-class="icon" />
    <span v-if="title" class="menu-item-title">{{ title }}</span>
  </span>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
