<template>
  <elFrame :src="sqlApi" />
</template>
<script>
import { mapState } from 'pinia'
import { useApiStore } from '@/store'
import elFrame from '@/components/Iframe/index.vue'
export default {
  name: 'Sql',
  components: { elFrame },
  computed: {
    ...mapState(useApiStore, ['sqlApi'])
  }
}
</script>
