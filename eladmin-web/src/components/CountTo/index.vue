<template>
  <span>{{ displayValue }}</span>
</template>

<script>
export default {
  name: 'CountTo',
  props: {
    startVal: { type: Number, default: 0 },
    endVal: { type: Number, default: 0 },
    duration: { type: Number, default: 2600 }
  },
  data() {
    return {
      displayValue: this.startVal,
      rafId: null
    }
  },
  mounted() {
    this.start()
  },
  beforeUnmount() {
    if (this.rafId) cancelAnimationFrame(this.rafId)
  },
  methods: {
    start() {
      const startTime = performance.now()
      const diff = this.endVal - this.startVal
      const tick = (now) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / this.duration, 1)
        // easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
        this.displayValue = Math.floor(this.startVal + diff * ease)
        if (progress < 1) {
          this.rafId = requestAnimationFrame(tick)
        }
      }
      this.rafId = requestAnimationFrame(tick)
    }
  }
}
</script>
