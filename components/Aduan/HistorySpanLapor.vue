<template>
  <div v-if="$store.state.logSpan.length > 0" class="w-full">
    <div
      v-for="(log, index) in $store.state.logSpan"
      :key="index"
      class="flex mt-3"
    >
      <div class="w-full">
        <CardLogSpan>
          <div class="font-lato flex justify-start text-[12px] mt-1 ml-2">
            <BaseIconSvg
              icon="/icon/calender.svg"
              class="!shadow-lg !w-[14px] !h-[14px]"
              :fill-color="'#9E9E9E'"
            />
            <span
              class="text-gray-500 mb-1 text-[11px] dark:text-dark-text-low ml-2"
            >{{ log.date }}</span>
          </div>
          <!-- <TextMilestone class="flex justify-start">

            <div>
              <span
                class="log-span font-medium text-gray-900 dark:text-dark-text-high"
              >{{ log.keterangan }}</span>
            </div>
          </TextMilestone> -->
        </CardLogSpan>
      </div>
    </div>
  </div>
</template>

<script>
import CardLogSpan from './CardLogSpan.vue'
export default {
  name: 'HistorySpanLapor',
  components: { CardLogSpan }
}
</script>
<style>
.log-span {
  white-space: pre-wrap;
}
</style>
