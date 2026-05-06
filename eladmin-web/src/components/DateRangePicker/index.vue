<template>
  <el-date-picker
    v-model="val"
    :type="type"
    :value-format="valueFormat"
    :first-day-of-week="1"
    :shortcuts="shortcuts"
    :range-separator="rangeSeparator"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
  />
</template>

<script>
import { calendarShortcuts } from '@/utils/shortcuts'

export default {
  name: 'DateRangePicker',
  props: {
    modelValue: { type: [String, Array, Date], default: null },
    type: { type: String, default: 'daterange' },
    valueFormat: { type: String, default: 'YYYY-MM-DD HH:mm:ss' },
    rangeSeparator: { type: String, default: ':' },
    startPlaceholder: { type: String, default: '开始日期' },
    endPlaceholder: { type: String, default: '结束日期' }
  },
  emits: ['update:modelValue'],
  computed: {
    val: {
      get() {
        return this.modelValue
      },
      set(v) {
        this.$emit('update:modelValue', v)
      }
    },
    shortcuts() {
      return calendarShortcuts
    }
  }
}
</script>
