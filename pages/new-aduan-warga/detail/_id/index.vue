<template>
  <div class="w-full h-full p-4 bg-white min-h-screen">
    <div class="mb-5">
      <TrackingComplaintSearch />
    </div>
    <div
      class="border px-[26px] py-7 border-gray-300 rounded-lg mx-auto flex flex-col gap-[16px]"
    >
      <div class="flex flex-row justify-between">
        <TrackingComplaintHeader />
        <!-- <TrackingComplaintBadge class="self-center" status="NONE" /> -->
      </div>

      <hr />

      <TrackingComplaintFooter />

      <TrackingComplaintSwitcher
        class="justify-self-start"
        :items="tabItems"
        @click="getSelected($event)"
      />

      <div>

        <keep-alive>
          <component
            :is="currentTabComponent"
            v-if="currentTabComponent"
            :data-aduan="dataAduan"
            :loading="loading"
          />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchAduanData } from '~/utils'
export default {
  components: {
    HistoryComplaint: () => import('@/components/TrackingComplaint/History'),
    DetailComplaint: () => import('@/components/TrackingComplaint/Detail'),
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
