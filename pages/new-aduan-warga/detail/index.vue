<template>
  <div
    class="w-full h-full p-4 bg-white min-h-screen dark:bg-dark-emphasis-low"
  >
    <div class="mb-5">
      <TrackingComplaintSearch @input="onSearch" />
    </div>
    <div
      class="border px-[26px] py-7 border-gray-300 rounded-lg mx-auto flex flex-col gap-[16px] dark:border-dark-emphasis-medium"
    >
      <div class="tracking-header">
        <TrackingComplaintHeader :id-aduan="complaintData?.complaint_id" />
        <div class="tracking-badge-wrapper">
          <TrackingComplaintBadge
            v-for="status in lastStatus"
            :key="status"
            class="self-start tracking-badge"
            :status="status || ''"
          />
        </div>
      </div>

      <hr class="dark:border-dark-emphasis-medium" />

      <TrackingComplaintFooter
        :updated-at="complaintData?.updated_at"
        :created-at="complaintData?.created_at"
      />

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
            :is-loading-detail="isLoadingDetail"
            :is-loading-tracking="isLoadingTracking"
            :data-tracking="trackingData"
            :complaint-data="complaintData || {}"
            :error-message="errorMessage"
          />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '~/utils'

export default {
  components: {
    HistoryComplaint: () => import('@/components/TrackingComplaint/History'),
    DetailComplaint: () => import('@/components/TrackingComplaint/Detail'),
  },
  middleware: 'unleash',
  meta: {
    featureFlag: 'SAPAWARGA-WEB__ADUAN--ADUAN-TRACKING',
  },
  data() {
    return {
      tabItems: ['Riwayat Aduan', 'Detail Aduan'],
      selectedTab: 'Riwayat Aduan',
      complaintData: {},
      trackingData: [],
      isLoadingDetail: false,
      isLoadingTracking: false,
      search: '',
      errorMessage: '',
      lastStatus: [],
      token: null,
      grantType: 'client_credentials',
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
  async mounted() {
    await this.getToken()
  },
  methods: {
    formatDate,
    getSelected(value) {
      this.selectedTab = value
    },
    async getToken() {
      if (!this.token) {
        this.token = await this.$getToken(this.grantType)
      }
      return this.token
    },
    async getDetailComplaint() {
      this.isLoadingDetail = true
      try {
        const { data, status } = await this.$axios.get(
          `/aduan/complaints/${this.search}`,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        )

        const detailData = data.data
        if (status === 200) {
          this.complaintData = {
            complaint_id: detailData.complaint_id,
            description: detailData.description,
            complaint_category: detailData.complaint_category.name,
            complaint_sub_category: detailData.complaint_subcategory.name,
            complaint_category_child_name:
              detailData.complaint_category_child.name,
            complaint_subcategory_child_name:
              detailData.complaint_subcategory_child.name,
            address: {
              long: Number(detailData.longitude),
              lat: Number(detailData.latitude),
              detail: detailData.address_detail,
            },
            photos: detailData.photos,
            complaint_status_id: detailData.complaint_status_id,
            title: detailData.title,
            updated_at: formatDate(
              detailData?.updated_at,
              'EEEE, dd MMMM yyyy - HH:mm'
            ),
            created_at: formatDate(
              detailData?.created_at,
              'EEEE, dd MMMM yyyy - HH:mm'
            ),
          }
        }
      } catch (error) {
        console.error(error)
        this.resetDataDetailAndTracking()
        this.errorMessage = error.response.data.message || ''
        throw error
      } finally {
        this.isLoadingDetail = false
      }
    },
    async getTrackingComplaint() {
      this.isLoadingTracking = true

      try {
        const { data, status } = await this.$axios.get(
          `/aduan/complaints/${this.search}/status`,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        )

        const trackingData = data.data
        if (status === 200) {
          this.trackingData = trackingData
          this.lastStatus = [trackingData[0].current_status]
          if (
            trackingData.length > 1 &&
            trackingData[1]?.current_status === 'directed_to_hotline_jabar' &&
            trackingData[0]?.current_status === 'finished'
          ) {
            this.lastStatus = [
              trackingData[1].current_status,
              trackingData[0].current_status,
            ]
          }
        }
      } catch (error) {
        console.error(error)
        this.resetDataDetailAndTracking()
        this.errorMessage = error.response?.data?.message || ''
        throw error
      } finally {
        this.isLoadingTracking = false
      }
    },
    async refreshTokenHandle() {
      this.token = ''
      this.grantType = 'refresh_token'
      await this.getToken()
    },
    async onSearch(value) {
      this.search = value
      this.resetDataDetailAndTracking()
      try {
        await this.getTrackingComplaint()
        await this.getDetailComplaint()
      } catch (error) {
        if (error.response?.data?.code === '4011400') {
          await this.refreshTokenHandle()
          await this.getTrackingComplaint()
          await this.getDetailComplaint()
        }
      }
    },
    resetDataDetailAndTracking() {
      this.complaintData = {}
      this.trackingData = []
      this.lastStatus = ''
    },
  },
}
</script>

<style scoped>
.tracking-badge-wrapper {
  @apply flex flex-col mt-2;
}

.tracking-badge {
  @apply mb-3 ml-2;
}

@media (min-width: 464px) {
  .tracking-header {
    @apply flex flex-row justify-between items-center;
  }

  .tracking-badge-wrapper {
    @apply mt-0 flex flex-row justify-end items-center;
  }

  .tracking-badge {
    @apply mb-0;
  }
}
</style>
