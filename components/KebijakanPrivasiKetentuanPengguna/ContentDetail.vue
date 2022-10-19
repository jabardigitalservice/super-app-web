<template>
  <div>
    <div class="container mx-auto mt-[16px] md:mt-[38px]">
      <div class="mx-[16px] md:mx-10">
        <div class="mb-[22px]">
          <Breadcumbs :title="dataJson.name" :link="dataJson.link" />
        </div>
        <component :is="dataJson.icon" class="icon" />
        <h1 class="uppercase font-roboto font-bold mt-[16px] text-[20px] dark:text-[#E9E9E9]">
          {{ dataJson.name }}
        </h1>
        <div class="flex items-center rounded-lg bg-gray-50 dark:bg-[#292C2A] mt-[16px] w-fit h-fit py-[8px] pl-[10px] pr-[8px]">
          <div class="flex-shrink-0">
            <IconCalendar />
          </div>
          <p class="ml-2 text-[12px] min-w-0 flex-1 dark:text[#AAB0B7]">
            Diperbaharui per tanggal <strong class="text-[12px] dark:text-[#E9E9E9]">{{ dataJson.updated }}</strong>
          </p>
        </div>
        <!-- eslint-disable vue/no-v-html -->
        <div class="mt-[16px] mb-[24px] text-[14px] font-lato text-[#424242] dark:text-[#AAB0B7]" v-html="dataJson.description" />
        <div v-show="dataJson.requirement" class=" bg-gray-50 py-[8px] rounded-lg w-full h-fit dark:bg-[#292C2A] mb-[24px] lg:w-fit pl-[10px] pr-[8px]">
          <div class="flex lg:items-center">
            <div class="flex-shrink-0 mt-1 lg:mt-0">
              <IconWarningCircle />
            </div>
            <div class="ml-2 text-gray-700 font-[400] text-[14px] dark:text-[#AAB0B7]" v-html="dataJson.requirement" />
          </div>
        </div>
      </div>
    </div>
    <div class="container mx-auto">
      <div class="md:mx-10">
        <div v-for="detail in dataJson.details" :key="detail.title">
          <AccordionDetail :title="detail.title" :description="detail.description" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcumbs from './Breadcumbs.vue'
import IconKetentuanPengguna from '~/assets/icon/ketentuan-pengguna.svg?inline'
import IconKebijakanPrivasi from '~/assets/icon/kebijakan-privasi.svg?inline'
import IconCalendar from '~/assets/icon/calendar.svg?inline'
import IconWarningCircle from '~/assets/icon/warning-circle.svg?inline'
import AccordionDetail from '~/components/KebijakanPrivasiKetentuanPengguna/AccordionDetail.vue'

export default {
  components: { IconKebijakanPrivasi, IconKetentuanPengguna, IconCalendar, IconWarningCircle, AccordionDetail, Breadcumbs },
  props: {
    dataJson: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped>
p{
  color:#424242;
}
@media (prefers-color-scheme: dark) {
  p{
    color:#AAB0B7;
  }
  .icon rect{
    fill: #292C2A;
  }
  .header-arrow line{
    stroke: #D7D7D7;
  }
}

</style>
