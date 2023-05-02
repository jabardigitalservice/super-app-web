<template class="h-screen bg-background dark:bg-dark-emphasis-low">
  <div
    class="bg-white w-full h-screen rounded-lg overflow-y-auto dark:bg-black"
  >
    <HistorySpanLapor />
  </div>
</template>

<script>
import HistorySpanLapor from '~/components/Aduan/HistorySpanLapor.vue'
export default {
  name: 'LogSpanLapor',
  components: { HistorySpanLapor }
}
</script>
