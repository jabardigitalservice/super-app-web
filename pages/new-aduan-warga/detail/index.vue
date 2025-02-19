<template>
  <div class="w-full h-full p-4 bg-white min-h-screen">
    <div class="mb-5">
      <TrackingComplaintSearch @input="onSearch" />
    </div>
    <div
      class="border px-[26px] py-7 border-gray-300 rounded-lg mx-auto flex flex-col gap-[16px]"
    >
      <div class="flex flex-row justify-between">
        <TrackingComplaintHeader :id-aduan="complaintData?.complaint_id" />
        <TrackingComplaintBadge
          class="self-center"
          :status="lastStatus || ''"
        />
      </div>

      <hr />

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
            :complaint-data="complaintData || {}"
            :is-loading="isLoading"
            :data-tracking="trackingData"
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
  data() {
    return {
      tabItems: ['Riwayat Aduan', 'Detail Aduan'],
      selectedTab: 'Riwayat Aduan',
      complaintData: {},
      trackingData: [],
      isLoading: false,
      search: '',
      errorMessage: '',
      lastStatus: '',
      token: null,
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
  mounted() {
    this.getToken()
  },
  methods: {
    formatDate,
    getSelected(value) {
      this.selectedTab = value
    },
    async getToken() {
      if (!this.token) {
        this.token = await this.$getToken()
      }
      return this.token
    },
    async getDetailComplaint() {
      this.isLoading = true
      try {
        const { data, status } = await this.$axiosNewAduan.get(
          `/v1/aduan/complaints/${this.search}`,
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
            address: {
              long: Number(detailData.longitude),
              lat: Number(detailData.latitude),
              detail: detailData.address_detail,
            },
            photos: detailData.photos,
            complaint_status_id: detailData.complaint_status_id,
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
        this.complaintData = {}
        this.errorMessage = error.response.data.message || ''
        console.log(error.response)
        if (error.response.data.code === '4011400') {
          this.getToken()
        }
      } finally {
        this.isLoading = false
      }
    },
    async getTrackingComplaint() {
      this.isLoading = true

      try {
        const { data, status } = await this.$axiosNewAduan.get(
          `/v1/aduan/complaints/${this.search}/status`,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        )

        const trackingData = data.data
        if (status === 200) {
          this.trackingData = trackingData
          this.lastStatus = trackingData[0].current_status
        }
      } catch (error) {
        console.error(error)
        this.trackingData = []
        this.errorMessage = error.response.data.message || ''
      } finally {
        this.isLoading = false
      }
    },
    onSearch(value) {
      this.search = value
      this.getDetailComplaint()
      this.getTrackingComplaint()
    },
  },
}
</script>
