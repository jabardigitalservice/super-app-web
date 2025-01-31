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
        <TrackingComplaintBadge class="self-center" status="NONE" />
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
          <component :is="currentTabComponent" />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    HistoryComplaint: () => import('@/components/TrackingComplaint/History'),
    DetailComplaint: () => import('@/components/TrackingComplaint/Detail'),
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
