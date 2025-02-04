<template>
  <div v-if="$store.state.logSpan.length > 0" class="w-full">
    <div
      v-for="(log, index) in $store.state.logSpan"
      :key="index"
      class="flex my-5"
    >
      <div class="w-full flex flex-col">
        <CardLogSpan>
          <div class="font-lato flex justify-start mt-1 ml-2">
            <BaseIconSvg
              icon="/icon/calender.svg"
              class="!shadow-lg !w-[14px] !h-[14px]"
              :fill-color="'#9E9E9E'"
            />
            <span
              class="text-gray-800 mb-1 text-xs dark:text-dark-text-low ml-2"
            >
              {{ log.date }}
            </span>
          </div>
        </CardLogSpan>
        <div class="font-lato mt-3 ml-8 bg-white dark:bg-black flex flex-col">
          <span class="text-sm mb-3 text-gray-800 dark:text-dark-text-high">
            {{ log.responder }}
          </span>

          <span class="text-sm mb-2 text-gray-600 dark:text-dark-text-high">
            Keterangan
          </span>
          <span class="log-span text-sm text-gray-900 dark:text-dark-text-high">
            {{ log.keterangan }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardLogSpan from './CardLogSpan.vue'
export default {
  name: 'HistorySpanLapor',
  components: { CardLogSpan },
}
</script>
<style>
.log-span {
  white-space: pre-wrap;
}
</style>
