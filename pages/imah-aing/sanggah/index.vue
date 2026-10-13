<template>
  <div class="min-h-screen bg-white dark:bg-dark-emphasis-low md:bg-gray-50 md:dark:bg-dark-emphasis-low">
    <div class="md:py-8 md:px-4">
      <div
        class="md:border md:border-gray-300 md:rounded-lg md:max-w-[650px] md:mx-auto md:bg-white md:dark:border-dark-emphasis-medium md:dark:bg-dark-emphasis-low"
      >
        <h1 class="px-4 pt-4 md:px-7 md:pt-5 uppercase font-roboto font-bold text-[20px]">
          Pengajuan Sanggah
        </h1>

        <hr class="mt-4 md:mt-5 dark:border-dark-emphasis-medium" />

        <ImahAingSanggah
          :item="item"
          :loading="isLoading"
          :load-error="loadError"
          :fallback-phone="fallbackPhone"
          @back="backToHistory"
          @retry="loadItem"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { decryptMetaQueryParam } from '~/utils/decode-meta'
import { getImahAingStatusKey, canSanggahStatus } from '~/constant/imah-aing-status'
import { isImahAingSelfItem } from '~/constant/imah-aing-sanggah'
import { imahAingMockData } from '~/constant/imah-aing-mock-data'

export default {
  name: 'ImahAingSanggahPage',
  data() {
    return {
      item: null,
      isLoading: true,
      loadError: ''
    }
  },
  computed: {
    ...mapState('imahAingHistory', ['authToken', 'metaPayload']),
    useMock() {
      return this.$route.query.use_mock === 'true'
    },
    complaintId() {
      const { id } = this.$route.query
      return Array.isArray(id) ? id[0] : id
    },
    // No HP dari meta hanya dipakai bila usulan milik sendiri (guard sudah menjamin)
    fallbackPhone() {
      return this.metaPayload?.phone || ''
    }
  },
  beforeDestroy() {
    this.RESET_SANGGAH()
  },
  async mounted() {
    const { meta } = this.$route.query
    const metaStr = Array.isArray(meta) ? meta[0] : meta
    const decoded = metaStr
      ? await decryptMetaQueryParam(metaStr, this.$config.metadataSecret)
      : null

    if (decoded) {
      this.SET_META_PAYLOAD(decoded)
    }

    if (!this.useMock && (!decoded || !decoded.token)) {
      this.backToHistory(true)
      return
    }

    if (!this.useMock && !this.authToken) {
      try {
        const token = await this.$getToken('client_credentials')
        this.setAuthToken(token)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to get token:', error)
      }
    }

    await this.loadItem()
  },
  methods: {
    ...mapActions('imahAingHistory', ['fetchDetail', 'setAuthToken']),
    ...mapMutations('imahAingHistory', ['SET_META_PAYLOAD']),
    ...mapMutations('imahAingSanggah', {
      SET_COMPLAINT_ID: 'SET_COMPLAINT_ID',
      RESET_SANGGAH: 'RESET_STATE'
    }),

    async loadItem() {
      if (!this.complaintId) {
        this.backToHistory(true)
        return
      }

      this.isLoading = true
      this.loadError = ''

      try {
        const detail = this.useMock
          ? imahAingMockData.find((row) => row.id === this.complaintId) || null
          : await this.fetchDetail(this.complaintId)

        // Guard: usulan tidak ada / bukan milik sendiri / status tidak eligible
        if (
          !detail ||
          !isImahAingSelfItem(detail, this.metaPayload) ||
          !canSanggahStatus(getImahAingStatusKey(detail))
        ) {
          this.backToHistory(true)
          return
        }

        this.item = detail
        this.SET_COMPLAINT_ID(detail.id || this.complaintId)
      } catch (error) {
        this.loadError =
          error?.response?.data?.message || error.message || 'Gagal memuat data usulan'
      } finally {
        this.isLoading = false
      }
    },

    backToHistory(replace = false) {
      const { id, ...query } = this.$route.query
      const target = { path: '/imah-aing', query }
      return replace === true ? this.$router.replace(target) : this.$router.push(target)
    }
  }
}
</script>
