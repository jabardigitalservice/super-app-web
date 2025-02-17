<template>
  <div class="w-full h-full p-4 bg-white min-h-screen">
    <div class="mb-5">
      <TrackingComplaintSearch @input="onSearch" />
    </div>
    <div
      class="border px-[26px] py-7 border-gray-300 rounded-lg mx-auto flex flex-col gap-[16px]"
    >
      <!-- TODO: ADD CONDITION FIRST RENDER PAGES AND ADD CONDITION IF DATA NOT FOUND -->
      <!-- <TrackingComplaintNoData v-if="complaintData.length === 0" title="Aduan tidak ditemukan" /> -->

      <div class="flex flex-row justify-between">
        <TrackingComplaintHeader :id-aduan="complaintData?.complaint_id" />
        <TrackingComplaintBadge
          class="self-center"
          :status="complaintData?.complaint_status_id"
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
            :complaint-data="complaintData || []"
            :is-loading="isLoading"
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
      tabItems: ['Detail Aduan', 'Riwayat Aduan'],
      selectedTab: 'Detail Aduan',
      complaintData: {},
      isLoading: false,
      search: '',
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
    formatDate,
    getSelected(value) {
      this.selectedTab = value
    },
    async getDetailComplaint() {
      this.isLoading = true
      try {
        // TODO: CHANGES THIS URL API FI READY
        const response = await this.$authAxios.get(
          `/v1/aduan/complaints/${this.search}`
        )
        if (response.status === 200) {
          this.complaintData = {
            complaint_id: response.data.complaint_id,
            description: response.data.description,
            complaint_category: response.data.complaint_category.name,
            address: {
              long: response.data.longitude,
              lat: response.data.latitude,
              detail: response.data.address_detail,
            },
            photos: response.data.photos,
            complaint_status_id: response.data.complaint_status_id,
            updated_at: formatDate(
              response?.data?.updated_at,
              'EEEE, dd MMMM yyyy - HH:mm'
            ),
            created_at: formatDate(
              response?.data?.created_at,
              'EEEE, dd MMMM yyyy - HH:mm'
            ),
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    async getTrackingComplaint() {
      this.isLoading = true

      try {
        const response = await this.$authAxios.get(
          `/v1/aduan/complaints/${this.search}/status`
        )
        // TODO: FIX AFTER API READY
        console.log(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    onSearch(value) {
      this.search = value
      this.getDetailComplaint()
    },
  },
}
</script>
