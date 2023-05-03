<template class="h-screen bg-background dark:bg-dark-emphasis-low">
  <div
    class="bg-white w-full h-screen rounded-lg overflow-y-auto dark:bg-black"
  >
    <div class="p-4">
      <BaseSpinner :show-spinner="loading" />
      <Milestone :data-milestone="data" @open-dialog="openDialog" />
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
export default {
  name: 'DetailAduanWarga',
  components: { Milestone },
  data () {
    return {
      data: [],
      token: '',
      idSpanLaporIsExists: false,
      showDialog: false,
      loading: false
    }
  },
  async fetch () {
    this.loading = true
    try {
      const response = await this.$axios.post(
        'https://api.coredatajds.id/api-aduanjsa-tracking/aduan/login',
        {
          username: 'jsa_aduan_api',
          password: 'fde92ef9514076'
        }
      )

      this.token = response.data.access_token
      if (this.token) {
        this.getDataAduanById()
      }
    } catch (error) {
      this.$newrelicSetup.noticeError(error)
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
    },
    async getDataAduanById () {
      if (this.token) {
        try {
          const response = await this.$axios.post(
            'https://api.coredatajds.id/api-aduanjsa-tracking/aduan/id_aduan',
            {
              id_aduan: this.$route.params.id
            },
            {
              headers: {
                Authorization: `Bearer ${this.token}`
              }
            }
          )
          this.data = response.data
          this.loading = false
        } catch (error) {
          this.$newrelicSetup.noticeError(error)
        }
      }
    }
  }
}
</script>
