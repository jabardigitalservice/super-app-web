<template>
  <div class="flex flex-col">
    <span
      class="font-bold text-[16px] text-gray-900 dark:text-dark-text-high leading-5 font-roboto"
    >Detail Aduan</span>
    <div class="grid grid-cols-2 mt-3">
      <div class="flex flex-col">
        <TextTitle>No. Aduan</TextTitle>
        <TextDetail>dsasa</TextDetail>
      </div>
      <div class="flex flex-col">
        <TextTitle>Diadukan Pada</TextTitle>
        <TextDetail>asdas</TextDetail>
      </div>
    </div>
    <div class="mt-3 flex flex-col">
      <TextTitle>Judul Aduan</TextTitle>
      <TextDetail>Judul Aduan</TextDetail>
    </div>
    <div class="mt-3 flex flex-col">
      <TextTitle>Permasalahaan</TextTitle>
      <TextDetail>
        Jaluar akses menuju lembang rusak parah, banyak terjadi kecelakan
        dikarenakan jalan rusak ini. mohon bantuannya agar dapat segera
        dilakukan perbaikan oleh pemda setempat dan dinas terkait.
      </TextDetail>
    </div>
  </div>
</template>

<script>
import TextTitle from './TextTitle.vue'
import TextDetail from './TextDetail.vue'
export default {
  name: 'DetailAduan',
  components: {
    TextTitle,
    TextDetail
  }
}
</script>
