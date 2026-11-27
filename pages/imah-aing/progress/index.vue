<template>
  <div class="min-h-screen bg-white dark:bg-dark-emphasis-low md:bg-gray-50 md:dark:bg-dark-emphasis-low">
    <div class="md:py-8 md:px-4">
      <div
        class="md:border md:border-gray-300 md:rounded-lg md:max-w-[650px] md:mx-auto md:bg-white md:dark:border-dark-emphasis-medium md:dark:bg-dark-emphasis-low"
      >
        <h1 class="px-4 pt-4 md:px-7 md:pt-5 uppercase font-roboto font-bold text-[20px] dark:text-dark-emphasis-high">
          Progres Perbaikan
        </h1>

        <hr class="mt-4 md:mt-5 dark:border-dark-emphasis-medium" />

        <template v-if="item && saved">
          <ImahAingMockBanner class="mx-4 mt-4 md:mx-7" />
          <ImahAingProgress :key="item.id" :item="item" :saved="saved" @back="backToHistory" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { getImahAingStatusKey, canUpdateProgressStatus } from '~/constant/imah-aing-status'
import { isImahAingMock, IMAH_AING_MOCK_ITEMS } from '~/constant/imah-aing-mock-data'

export default {
  name: 'ImahAingProgressPage',
  middleware: 'imah-aing-access',
  computed: {
    ...mapState('imahAingProgress', ['records']),
    isMock() {
      return isImahAingMock(this.$route.query)
    },
    // shortcut: hanya data contoh; saat integrasi ganti dengan fetchDetail + guard kepemilikan (pola halaman sanggah)
    item() {
      if (!this.isMock) return null
      const found = IMAH_AING_MOCK_ITEMS.find((item) => item.id === this.$route.query.id)
      return found && canUpdateProgressStatus(getImahAingStatusKey(found)) ? found : null
    },
    saved() {
      return this.item ? this.records[this.item.id] : null
    }
  },
  watch: {
    // Sama dengan halaman riwayat: ganti mode tanpa remount → muat ulang penuh
    isMock() {
      window.location.reload()
    }
  },
  mounted() {
    if (!this.isMock) this.RESET_STATE()
    // Di luar mode data contoh, id tidak dikenal, atau status tidak memenuhi → riwayat
    if (!this.item) {
      this.backToHistory(true)
      return
    }
    this.INIT_RECORD({ id: this.item.id, steps: this.item.progress })
  },
  methods: {
    ...mapMutations('imahAingProgress', ['INIT_RECORD', 'RESET_STATE']),
    backToHistory(replace = false) {
      const { id, ...query } = this.$route.query
      const target = { path: '/imah-aing', query }
      return replace === true ? this.$router.replace(target) : this.$router.push(target)
    }
  }
}
</script>
