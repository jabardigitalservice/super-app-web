<template>
  <div class="w-full h-full p-4 bg-white min-h-screen">
    <div class="mb-5">
      <TrackingComplaintSearch />
    </div>
    <div
      class="border px-[26px] py-7 border-gray-300 rounded-lg mx-auto flex flex-col gap-[16px]"
    >
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
            :complaint-data="complaintData"
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
      complaintData: null,
      isLoading: false,
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
    this.fetchComplaintData()
  },
  methods: {
    formatDate,
    getSelected(value) {
      this.selectedTab = value
    },
    async fetchComplaintData() {
      this.isLoading = true
      try {
        const response = await this.$axios.get(
          '/v1/aduan/complaints/:id/status'
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
        // TODO :  REMOVE THIS AFTER API READ (EXAMPLE READY DATA NO REAL)
        this.complaintData = {
          complaint_id: 'SWA202412020001',
          address: {
            long: 107.5433112680912,
            lat: -6.850021397588075,
            detail: 'yeyeyeyeyeye',
          },
          complaint_category: 'Ekonomi Dan Keuangan',
          description: 'okelah',
          photos: [
            {
              url: 'https://file.digitalservice.id/superapp-utilities-public/utilities/files/AhtD9VX9QpadQjs2.jpg',
            },
            {
              url: 'https://randomwordgenerator.com/img/picture-generator/57e0d4474354ae14f1dc8460962e33791c3ad6e04e5074417d2e72d1964dc6_640.jpg',
            },
            {
              url: 'https://randomwordgenerator.com/img/picture-generator/55e1d14b4a5aac14f1dc8460962e33791c3ad6e04e507440752f72d39748c1_640.jpg',
            },
            {
              url: 'https://randomwordgenerator.com/img/picture-generator/57e3d14b4b5aa514f1dc8460962e33791c3ad6e04e507440702d79d39748cd_640.jpg',
            },
          ],
          complaint_status_id: 'finished',
          updated_at: formatDate(
            '2024-12-12T12:50:00.363565Z',
            'EEEE, dd MMMM yyyy - HH:mm'
          ),
          created_at: formatDate(
            '2024-12-12T12:50:00.363565Z',
            'EEEE, dd MMMM yyyy - HH:mm'
          ),
        }
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
