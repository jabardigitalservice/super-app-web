<template>
 <div>
  test aduan
 </div>
</template>

<script>
import { fetchAduanData } from '~/utils'
export default {
  components: {
    // HistoryComplaint: () => import('@/components/TrackingComplaint/History'),
    // DetailComplaint: () => import('@/components/TrackingComplaint/Detail'),
  },
  async asyncData({ $aduanAPI, params, $config }) {
    let loading = true
    let dataAduan = []

    try {
      const data = await fetchAduanData($aduanAPI, params.id, $config)

      dataAduan = data

      loading = false
    } catch (error) {
      console.error('fetch data ', error)
      loading = false
    }

    return {
      loading,
      dataAduan,
    }
  },
  data() {
    return {
      tabItems: ['Riwayat Aduan', 'Detail Aduan'],
      selectedTab: 'Riwayat Aduan',
    }
  },
  computed: {
    currentTabComponent() {
      switch (this.selectedTab) {
        case 'Riwayat Aduan':
          return 'HistoryComplaint'
        case 'Detail Aduan':
          return 'DetailComplaint'
        default:
          return null
      }
    },
  },
  methods: {
    getSelected(value) {
      this.selectedTab = value
    },
  },
}
</script>
