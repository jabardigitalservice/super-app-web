<template>
  <div class="flex flex-col">
    <span
      class="font-bold text-[16px] text-gray-900 dark:text-dark-text-high leading-5 font-roboto"
    >Detail Aduan</span>
    <div class="grid grid-cols-2 mt-3">
      <div class="flex flex-col gap-y-1">
        <TextTitle>No. Aduan</TextTitle>
        <TextDetail>{{ dataAduan[0]?.id_aduan }}</TextDetail>
      </div>
      <div class="flex flex-col gap-y-1">
        <TextTitle>Diadukan Pada</TextTitle>
        <TextDetail>
          {{
            formatDate(
              dataAduan[0]?.tanggal_update,
              "EEEE, dd MMMM yyyy - HH:mm"
            )
          }}
        </TextDetail>
      </div>
    </div>
    <div class="mt-3 flex flex-col gap-y-1">
      <TextTitle>Judul Aduan</TextTitle>
      <TextDetail>{{ dataAduan[0]?.judul_aduan || "-" }}</TextDetail>
    </div>
    <div class="mt-3 flex flex-col gap-y-1">
      <TextTitle>Permasalahaan</TextTitle>
      <TextDetail>
        {{ dataAduan[0].detail_aduan || "-" }}
      </TextDetail>
    </div>
    <div
      v-if="dataAduan[0]?.foto_bukti_kejadian_evidence"
      class="mt-3 flex flex-col gap-y-1"
    >
      <TextTitle> Foto Aduan </TextTitle>
      <a
        download
        target="_blank"
        :href="dataAduan[0]?.foto_bukti_kejadian_evidence"
        class="px-4 py-3 flex text-[12px] font-lato text-gray-800 font-bold border border-gray-300 rounded-md p-4 bg-white w-full mt-2 dark:border-0 dark:bg-dark-emphasis-medium dark:text-dark-text-high"
      >
        <div class="flex items-center gap-3 w-full justify-center">
          <BaseIconSvg
            icon="/icon/icon-image.svg"
            class="!shadow-lg !w-[14px] !h-[14px]"
            fill-color="#16A75C"
          />
          Lihat Foto Aduan
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import TextTitle from './TextTitle.vue'
import TextDetail from './TextDetail.vue'
import { formatDate } from '~/utils'
export default {
  name: 'DetailAduan',
  components: {
    TextTitle,
    TextDetail
  },
  props: {
    dataAduan: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatDate,
    downloadFile (file) {
      console.log(file)
    }
  }
}
</script>
