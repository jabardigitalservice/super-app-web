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
  async asyncData ({ $axios, $newrelicSetup, params, redirect }) {
    try {
      const response = await $axios.post(
        'https://api.coredatajds.id/api-aduanjsa-tracking/aduan/login',
        {
          username: 'jsa_aduan_api',
          password: 'fde92ef9514076'
        }
      )

      const token = response.data.access_token

      if (token) {
        const dataResponse = await $axios.post(
          'https://api.coredatajds.id/api-aduanjsa-tracking/aduan/id_aduan',
          {
            id_aduan: params.id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        // console.log(dataResponse.data)

        if (dataResponse.data.length > 0) {
          return {
            loading: false,
            token,
            data: dataResponse.data
          }
        } else {
          redirect(`/aduan-warga/not-found/${params.id}`)
        }
      }
    } catch (error) {
      // silent error
      $newrelicSetup.noticeError(error)
    }
  },
  data () {
    return {
      data: [],
      token: '',
      idSpanLaporIsExists: false,
      showDialog: false,
      loading: true
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
