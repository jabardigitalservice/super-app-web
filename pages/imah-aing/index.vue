<template>
  <div class="min-h-screen bg-white dark:bg-dark-emphasis-low md:bg-gray-50 md:dark:bg-dark-emphasis-low">
    <!-- Mobile: full-width | Desktop: centered card -->
    <div class="md:py-8 md:px-4">
      <div
        class="md:border md:border-gray-300 md:rounded-lg md:max-w-[650px] md:mx-auto md:bg-white md:dark:border-dark-emphasis-medium md:dark:bg-dark-emphasis-low"
      >
        <!-- Heading H1-D pattern -->
        <h1 class="px-4 pt-4 md:px-7 md:pt-5 uppercase font-roboto font-bold text-[20px]">
          Riwayat Ajuan
        </h1>

        <hr class="mt-4 md:mt-5 dark:border-dark-emphasis-medium" />

        <div class="px-4 py-4 md:px-7 md:py-5">
          <!-- Add new submission -->
          <div class="flex justify-end mb-4">
            <Button v-if="!isWarga" variant="primary" @click="goToForm">
              + Tambah
            </Button>
          </div>

          <!-- Loading skeleton -->
          <ImahAingHistorySkeleton v-if="isLoading" />

          <!-- Empty state -->
          <ImahAingHistoryNoData v-else-if="!isLoading && items.length === 0" />

          <!-- List -->
          <div v-else class="flex flex-col gap-3 md:gap-4">
            <ImahAingHistoryListItem
              v-for="item in items"
              :key="item.id"
              :item="item"
              :selected="selectedIds.includes(item.id)"
              :can-edit="canEdit(item)"
              :is-self-item="isSelfItem(item)"
              :proposer-role="isSelfItem(item) ? (metaPayload.role || '') : (item.proposer_role || '')"
              @toggle="toggleSelect(item.id)"
              @click="openPreview(item)"
              @edit="editUsulan(item)"
              @show-info="showEditInfo"
            />

            <!-- Load more -->
            <div v-if="hasMore" class="text-center py-4">
              <Button
                variant="secondary"
                :loading="status === 'LOADING'"
                @click="loadMore"
              >
                Muat Lebih Banyak
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating bottom bar — mobile full-width, desktop centered -->
    <div
      v-if="selectedIds.length > 0"
      class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.08)] z-10 dark:bg-dark-emphasis-low dark:border-dark-emphasis-medium md:max-w-[650px] md:mx-auto md:left-1/2 md:-translate-x-1/2 md:rounded-t-xl md:border md:border-b-0 md:shadow-lg"
    >
      <Button
        variant="danger"
        class="w-full !justify-center"
        :loading="isCancelling"
        @click="confirmCancel"
      >
        Batalkan Pengajuan ({{ selectedIds.length }})
      </Button>
    </div>

    <!-- Preview Modal -->
    <ImahAingHistoryPreviewModal
      :open="previewOpen"
      :item="previewItem"
      @close="previewOpen = false"
    />

    <!-- Info snackbar for edit restriction -->
    <div
      v-if="showInfoSnackbar"
      class="fixed bottom-20 left-4 right-4 z-20 md:max-w-[650px] md:mx-auto md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-[calc(650px-2rem)] bg-gray-700 text-white text-sm rounded-lg px-4 py-3 shadow-lg"
    >
      Usulan hanya dapat di-update oleh Pengusul. Proses Update hanya berlaku selama Usulan masih dalam status Menunggu Verifikasi atau Tahap Verifikasi.
    </div>

    <!-- Cancel Confirmation Dialog -->
    <BaseDialog
      :show-popup="showCancelDialog"
      title="Batalkan Pengajuan"
      label-button-approve="Ya, Batalkan"
      label-button-reject="Batal"
      @close="showCancelDialog = false"
      @reject="showCancelDialog = false"
      @submit="handleCancel"
    >
      Apakah Anda yakin ingin membatalkan usulan untuk {{ selectedIds.length }} pengajuan ini?
    </BaseDialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { decodeMetaQueryParam } from '~/utils/decode-meta'

export default {
  data() {
    return {
      previewOpen: false,
      previewItem: null,
      showCancelDialog: false,
      showInfoSnackbar: false
    }
  },
  computed: {
    ...mapState('imahAingHistory', ['items', 'selectedIds', 'pagination', 'status', 'errorMessage', 'authToken', 'metaPayload']),
    isLoading() {
      return this.status === 'LOADING' && this.pagination.page === 1
    },
    isCancelling() {
      return this.status === 'CANCELLING'
    },
    hasMore() {
      return this.pagination.hasMore
    },
    useMock() {
      return this.$route.query.use_mock === 'true'
    },
    isWarga() {
      return (this.metaPayload?.role || '').trim().toLowerCase() === 'warga'
    }
  },
  created() {
    // Decode meta query param di created (sama seperti form page)
    const { meta } = this.$route.query
    const metaStr = Array.isArray(meta) ? meta[0] : meta
    const decoded = metaStr ? decodeMetaQueryParam(metaStr) : null

    if (decoded) {
      this.$store.commit('imahAingHistory/SET_META_PAYLOAD', decoded)
      this.decodedMeta = decoded
    }

    // Mode mock (?use_mock=true) → lewati guard token
    if (this.useMock) {
      return
    }

    // Guard #1 — tidak ada token dari meta → redirect ke form
    if (!decoded || !decoded.token) {
      this.redirectToForm()
    }
  },
  async mounted() {
    // Mode mock → tampilkan data mock tanpa API & tanpa redirect
    if (this.useMock) {
      this.loadMockData()
      return
    }

    // Dapatkan token dari Keycloak (sama seperti form page)
    if (!this.authToken) {
      try {
        const token = await this.$getToken('client_credentials')
        this.$store.dispatch('imahAingHistory/setAuthToken', token)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to get token:', error)
      }
    }

    if (this.decodedMeta) {
      await this.fetchHistory()
      // Guard #2 — sukses tapi tidak ada riwayat → redirect ke form
      if (this.status === 'SUCCESS' && this.items.length === 0) {
        this.redirectToForm()
      }
    }
  },
  beforeDestroy() {
    this.RESET_STATE()
  },
  methods: {
    ...mapActions('imahAingHistory', ['fetchHistory', 'cancelSubmissions', 'loadMockData']),
    ...mapMutations('imahAingHistory', ['TOGGLE_SELECT_ID', 'SET_PAGINATION', 'RESET_STATE']),

    async loadMore() {
      this.SET_PAGINATION({ page: this.pagination.page + 1 })
      await this.fetchHistory()
    },

    toggleSelect(id) {
      this.TOGGLE_SELECT_ID(id)
    },

    openPreview(item) {
      this.previewItem = item
      this.previewOpen = true
    },

    confirmCancel() {
      this.showCancelDialog = true
    },

    redirectToForm() {
      this.$router.replace({
        path: '/imah-aing/form',
        query: this.$route.query,
      })
    },

    goToForm() {
      this.$router.push({
        path: '/imah-aing/form',
        query: this.$route.query,
      })
    },

    isSelfItem(item) {
      if (!item) return false
      const { id, kk } = this.metaPayload || {}
      if (item.user_id && id && item.user_id === id) return true
      if (this.isWarga && item.user_kk && kk && item.user_kk === kk) return true
      return false
    },

    canEdit(item) {
      const EDITABLE_STATUSES = ['unverified', 'rejected_appeal']
      const statusId = item.complaint_status?.id || item.complaint_status_id || ''
      return this.isSelfItem(item) && EDITABLE_STATUSES.includes(statusId)
    },

    editUsulan(item) {
      this.$router.push({
        path: '/imah-aing/form',
        query: {
          ...this.$route.query,
          edit: item.id,
        },
      })
    },

    showEditInfo() {
      this.showInfoSnackbar = true
      setTimeout(() => { this.showInfoSnackbar = false }, 4000)
    },

    async handleCancel() {
      try {
        await this.cancelSubmissions()
        this.showCancelDialog = false
      } catch (error) {
        // Error is handled in store status
      }
    }
  }
}
</script>

