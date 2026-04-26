import Date from './datetime.js'

export const calendarBaseShortcuts = [{
  text: '今天',
  value: () => {
    const startTime = new Date(new Date().setHours(0, 0, 0))
    const endTime = new Date(new Date().setHours(23, 59, 59))
    return [startTime, endTime]
  }
}, {
  text: '昨天',
  value: () => {
    const startTime = new Date(new Date().daysAgo(1).setHours(0, 0, 0))
    const endTime = new Date(new Date().daysAgo(1).setHours(23, 59, 59))
    return [startTime, endTime]
  }
}, {
  text: '本周',
  value: () => {
    const startTime = new Date(new Date().daysAgo(new Date().getDay() - 1).setHours(0, 0, 0))
    const endTime = new Date(new Date().setHours(23, 59, 59))
    return [startTime, endTime]
  }
}, {
  text: '这个月',
  value: () => {
    const startTime = new Date(new Date().monthBegin().setHours(0, 0, 0))
    const endTime = new Date(new Date().setHours(23, 59, 59))
    return [startTime, endTime]
  }
}, {
  text: '当前季度',
  value: () => {
    const startTime = new Date(new Date().quarterBegin().setHours(0, 0, 0))
    const endTime = new Date(new Date().setHours(23, 59, 59))
    return [startTime, endTime]
  }
}, {
  text: '最近30天',
  value: () => {
    const startTime = new Date(new Date().daysAgo(30).setHours(0, 0, 0))
    const endTime = new Date(new Date().setHours(23, 59, 59))
    return [startTime, endTime]
  }
}]

// Element Plus 的 shortcut 不再提供 picker.value 上下文
// 相对“前一天/后一天”的语义改为相对今天，保持基础可用，避免依赖已弃用的 picker 实例
export const calendarMoveShortcuts = [{
  text: '‹ 昨天 ',
  value: () => {
    const startTime = new Date(new Date().daysAgo(1).setHours(0, 0, 0))
    const endTime = new Date(new Date().daysAgo(1).setHours(23, 59, 59))
    return [startTime, endTime]
  }
}, {
  text: ' 明天 ›',
  value: () => {
    const startTime = new Date(new Date().daysAgo(-1).setHours(0, 0, 0))
    const endTime = new Date(new Date().daysAgo(-1).setHours(23, 59, 59))
    return [startTime, endTime]
  }
}]

export const calendarShortcuts = [
  ...calendarBaseShortcuts,
  ...calendarMoveShortcuts
]
