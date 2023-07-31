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
  async asyncData ({ $aduanAPI, $newrelicSetup, params, $config }) {
    let loading = true
    let dataAduan = []

    try {
      const data = await fetchAduanData(
        $aduanAPI,
        $newrelicSetup,
        params.id,
        $config
      )

      dataAduan = data
      loading = false
    } catch (error) {
      $newrelicSetup.noticeError(error)

      loading = false
    }

    return {
      loading,
      dataAduan
    }
  },
  data () {
    return {
      idSpanLaporIsExists: false,
      showDialog: false
    }
  },

  head () {
    return {
      title: `Status Aduan - ID ${this.$route.params.id}`
    }
  },
  methods: {
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
