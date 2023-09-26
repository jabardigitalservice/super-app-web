<template>
  <div class="flex flex-col">
    <h6
      class="font-bold text-[16px] text-gray-900 dark:text-dark-text-high leading-5 font-roboto"
    >
      Detail Aduan
    </h6>
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
        {{ showFullText ? dataAduan[0]?.detail_aduan : truncatedText }}
      </TextDetail>
      <button
        v-if="isTruncated"
        class="text-green-600 font-bold leading-4 mt-2 text-left text-[12px]"
        @click="toggleTruncate"
      >
        {{ showFullText ? "Lihat lebih sedikit" : "Lihat selengkapnya" }}
      </button>
    </div>
    <div
      v-if="dataAduan[0]?.foto_bukti_kejadian_evidence"
      class="mt-3 flex flex-col gap-y-1"
    >
      <TextTitle> Foto Aduan </TextTitle>
      <button
        class="px-4 py-3 flex text-[12px] font-lato text-gray-800 font-bold border border-gray-300 rounded-md p-4 bg-white w-full mt-2 dark:border-0 dark:bg-dark-emphasis-medium dark:text-dark-text-high"
        @click="goToPageFile(dataAduan[0].foto_bukti_kejadian_evidence.split('\n'))"
      >
        <div class="flex items-center gap-3 w-full justify-center">
          <BaseIconSvg
            icon="/icon/icon-image.svg"
            class="!shadow-lg !w-[14px] !h-[14px]"
            fill-color="#16A75C"
          />
          Lihat Foto Aduan
        </div>
      </button>
    </div>
    </h1>
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
  data () {
    return {
      maxCharacters: 250,
      showFullText: false
    }
  },
  computed: {
    isTruncated () {
      return this.dataAduan[0]?.detail_aduan.length > this.maxCharacters
    },
    truncatedText () {
      return this.dataAduan[0]?.detail_aduan.length > this.maxCharacters
        ? this.dataAduan[0]?.detail_aduan.substring(0, this.maxCharacters) +
            '...'
        : this.dataAduan[0]?.detail_aduan
    }
  },
  methods: {
    formatDate,
    toggleTruncate () {
      this.showFullText = !this.showFullText
    },
    goToPageFile (file) {
      this.$store.commit('setFileAduan', file)
      this.$router.push('/aduan-warga/file-aduan/foto-aduan')
    }
  }
}
</script>
