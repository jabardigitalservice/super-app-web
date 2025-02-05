<template>
  <div
    v-if="dataAduan"
    class="h-full bg-background dark:bg-dark-emphasis-low"
  >
    <BaseButtonBack />
    <div
      class="bg-white w-full h-full overflow-y-auto dark:bg-black"
    >
      <div class="p-4">
        <BaseSpinner :show-spinner="loading" />
        <AduanDetailAduan :data-aduan="dataAduan[0]" />
        <Milestone
          :data-milestone="dataAduan"
          class="mt-[32px]"
          @open-dialog="openDialog"
        />
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
  </div>
  <ErrorCustom v-else />
</template>

<script>
import Milestone from '~/components/Aduan/Milestone.vue';
import { fetchAduanData } from '~/utils';
export default {
  name: 'DetailAduanWarga',
  components: { Milestone },
  async asyncData ({ $aduanAPI,  params, $config }) {
    let loading = true
    let dataAduan = []

    try {
      const data = await fetchAduanData(
        $aduanAPI,
        params.id,
        $config
      )

      dataAduan = data

      loading = false
    } catch (error) {
      console.error('fetch data ', error)
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
      this.$router.push({ path: '/aduan-warga', query: this.$route.query })
    },
    goToCreateAduan () {
      this.$router.push({ path: '/aduan-warga/redirect-aduan', query: this.$route.query })
    }
  }
}
</script>
