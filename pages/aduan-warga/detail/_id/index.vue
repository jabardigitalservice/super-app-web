<template class="h-screen bg-background dark:bg-dark-emphasis-low">
  <div
    class="bg-white w-full h-screen rounded-lg overflow-y-auto dark:bg-black"
  >
    <div class="p-4">
      <BaseSpinner :show-spinner="loading" />
      <Milestone :data-milestone="dataAduan" @open-dialog="openDialog" />
    </div>

    <BaseBlurPopup :show-popup="showDialog" />

    <BaseDialog
      :show-popup="showDialog"
      title="Konfirmasi Penyelesaian"
      label-button-approve="Ya, Sangat Membantu"
      label-button-reject="Tidak, Buat Aduan Baru"
      :information-message="
        idSpanLaporIsExists
          ? `Aduan Anda akan ditutup oleh sistem sesuai dengan batas waktu yang ditentukan oleh SP4N LAPOR.`
          : ''
      "
      @close="showDialog = false"
      @submit="backToSearchAduan"
      @reject="goToCreateAduan"
    >
      Apakah penyelesaian dari instansi ini membantu?
    </BaseDialog>
  </div>
</template>

<script>
import Milestone from '~/components/Aduan/Milestone.vue'
import { fetchAduanData } from '~/utils'
export default {
  name: 'DetailAduanWarga',
  components: { Milestone },
  data () {
    return {
      idSpanLaporIsExists: false,
      showDialog: false,
      loading: false
    }
  },
  head () {
    return {
      title: `Status Aduan - ID ${this.$route.params.id}`
    }
  },
  computed: {
    dataAduan () {
      return this.$store.state.dataAduan
    }
  },
  created () {
    if (this.$store.state.dataAduan.length === 0) {
      this.loadData()
    }
  },
  methods: {
    async loadData () {
      this.loading = true
      try {
        const data = await fetchAduanData(
          this.$aduanAPI,
          this.$newrelicSetup,
          this.$route.params.id,
          this.$config
        )
        this.$store.commit('setDataAduan', data)
        this.$store.commit('setLogSpan', data?.log_span_lapor?.log?.reverse())

        this.loading = false
      } catch (error) {
        this.loading = false
        this.$newrelicSetup.noticeError(error)
      }
    },
    openDialog (idSpanLapor) {
      this.showDialog = true
      this.idSpanLaporIsExists = !!idSpanLapor
    },
    backToSearchAduan () {
      this.$router.push('/aduan-warga')
    },
    goToCreateAduan () {
      this.$router.push('/aduan-warga/redirect-aduan')
    }
  }
}
</script>
