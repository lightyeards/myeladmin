<template>
  <el-date-picker
    v-model="val"
    :type="type"
    :value-format="valueFormat"
    :default-time="defaultTime"
    :shortcuts="shortcuts"
    :first-day-of-week="1"
    :size="size"
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
    valueFormat: { type: String, default: 'yyyy-MM-dd HH:mm:ss' },
    defaultTime: { type: Array, default: () => ['00:00:00', '23:59:59'] },
    size: { type: String, default: 'small' },
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
