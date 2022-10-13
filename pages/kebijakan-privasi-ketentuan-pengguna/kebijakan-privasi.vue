<template class="bg-white dark:bg-black">
  <div class="container mx-auto mt-8">
    <div class="mx-10">
      <picture>
        <source
          :srcset="require(`@/assets/icons/${dataJson.pictureDark}`)"
          media="(prefers-color-scheme: dark)"
        >
        <img :src="require(`@/assets/icons/${dataJson.pictureLight}`)" width="49" height="49">
      </picture>
      <h1 class="uppercase font-bold mt-3">
        {{ dataJson.name }}
      </h1>
      <div class="flex items-center bg-gray-50 mt-3 w-[273px] h-[34px]">
        <div class="flex-shrink-0">
          <img :src="require('@/assets/icons/calendar.svg')" width="12" height="12" alt="calendar">
        </div>
        <p class="ml-2 text-[12px] min-w-0 flex-1">
          Diperbaharui per tanggal <b class="text-[12px]">{{ dataJson.updated }}</b>
        </p>
      </div>
      <div class="mt-3" v-html="dataJson.description" />
      <div v-for="detail in dataJson.details" :key="detail.title">
        <div v-html="detail.description" />
      </div>
    </div>
  </div>
</template>

<script>
import dataKebijakanPrivasi from '~/data/kebijakan-privasi.json'

export default {
  name: 'KebijakanPrivasi',
  data () {
    return { dataJson: dataKebijakanPrivasi }
  }
}
</script>

<style scoped>
  ol {
    list-style:decimal;
  }
  ol li{
    color:red;
  }
</style>
