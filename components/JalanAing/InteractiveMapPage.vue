<template>
  <section class="relative flex h-[calc(100vh-144px)] min-h-0 flex-row overflow-hidden font-lato md:h-[calc(100vh-64px)]">
    <button v-if="mobileLayerOpen" type="button" class="fixed inset-0 z-[700] bg-slate-900/45 backdrop-blur-sm md:hidden" aria-label="Tutup panel layer" @click="$emit('close-layer')" />
    <JalanAingLayerPanel :mobile-open="mobileLayerOpen" :layer-visibility="layerVisibility" :filter-status="filterStatus" :data-availability="dataAvailability" @toggle-layer="$emit('toggle-layer', $event)" @update-filter="$emit('update-filter', $event)" @close="$emit('close-layer')" />

    <div class="relative min-h-[560px] min-w-0 flex-1 overflow-hidden">
      <JalanAingLeafletMap
        ref="leafletMap"
        :layer-visibility="layerVisibility"
        :filter-status="filterStatus"
        @select-marker="selectMarker"
        @create-complaint="$emit('create-complaint', $event)"
        @toggle-layer="$emit('toggle-layer', $event)"
        @location-found="handleLocationFound"
        @location-error="handleLocationError"
        @notify="$emit('notify', $event)"
        @data-status="$emit('data-status', $event)"
        @search-results="searchResults = $event"
      />

      <form class="absolute left-4 right-4 top-4 z-[600] flex h-12 items-center gap-2 rounded-xl border-2 border-jalan-aing-primary bg-white px-3 shadow-lg md:hidden" @submit.prevent="submitSearch">
        <Icon name="magnifier" size="18px" class="shrink-0 text-slate-500" aria-hidden="true" />
        <input v-model="searchQuery" type="search" aria-label="Cari lokasi" placeholder="Cari jalan, faskes, CCTV..." class="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400">
      </form>
      <div v-if="searchResults.length" class="absolute left-4 right-4 top-20 z-[600] max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        <button v-for="road in searchResults" :key="road.id" type="button" class="block w-full border-b border-slate-100 px-4 py-3 text-left text-sm last:border-b-0 hover:bg-jalan-aing-primary-soft" @click="selectSearchResult(road)">
          <span class="block font-bold text-slate-800">{{ road.name }}</span><span class="text-xs text-slate-500">{{ road.city }}</span>
        </button>
      </div>

      <div v-if="selectedMarker" class="absolute bottom-4 left-4 right-4 z-[600] max-w-sm rounded-3xl border border-slate-200 bg-white/95 p-5 text-slate-800 shadow-2xl backdrop-blur-lg">
      <div class="flex items-start justify-between gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">{{ selectedMarker.type }}</span>
          <h3 class="mt-1 text-sm font-bold">{{ selectedMarker.label }}</h3>
        </div>
        <button type="button" class="text-slate-500 hover:text-slate-700" aria-label="Tutup detail marker" @click="selectedMarker = null"><Icon name="times" size="16px" /></button>
      </div>
      <p class="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
        Data layer ini mengikuti visual prototipe Jalan Aing. Detail API dapat disambungkan setelah kontrak GIS tersedia.
      </p>
      <button type="button" class="mt-3 w-full rounded-xl bg-jalan-aing-primary py-2.5 text-xs font-bold text-white" @click="$emit('notify', 'Detail layer siap dikembangkan')">
        Lihat detail layer
      </button>
      </div>

      <button type="button" class="absolute bottom-20 right-4 z-[600] flex h-12 w-12 items-center justify-center rounded-xl bg-jalan-aing-primary text-white shadow-xl transition hover:bg-jalan-aing-primary-dark active:scale-95 md:hidden" aria-label="Buat laporan kerusakan jalan" title="Buat laporan" @click="$emit('create-complaint')">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v5h4M9 12h6M9 16h6" />
        </svg>
      </button>
    </div>

    <JalanAingLocationPermissionDialog
      :open="locationPromptOpen"
      header="Akses Lokasi"
      name-icon="info-circle-outline"
      size="28px"
      title="Izinkan akses lokasi"
      description="Agar peta dapat langsung menunjukkan posisi Anda, izinkan akses lokasi pada browser."
      label-primary-button="Izinkan Lokasi"
      label-secondary-button="Nanti Saja"
      @confirm="requestLocation"
      @close="locationPromptOpen = false"
    />
  </section>
</template>

<script>
export default {
  name: 'JalanAingInteractiveMapPage',
  props: {
    layerVisibility: { type: Object, required: true },
    filterStatus: { type: Object, required: true },
    dataAvailability: { type: Object, required: true },
    mobileLayerOpen: { type: Boolean, default: false },
  },
  data() {
    return {
      selectedMarker: null,
      searchQuery: '',
      searchResults: [],
      locationPromptOpen: false,
      locationPromptTimer: null,
    }
  },
  mounted() {
    this.locationPromptTimer = window.setTimeout(() => this.prepareLocationAccess(), 450)
  },
  beforeDestroy() {
    window.clearTimeout(this.locationPromptTimer)
  },
  methods: {
    selectMarker(marker) {
      this.selectedMarker = marker
    },
    submitSearch() {
      this.$refs.leafletMap?.search(this.searchQuery)
      if (this.searchQuery.trim() && !this.searchResults.length) this.$emit('notify', 'Ruas jalan tidak ditemukan')
    },
    selectSearchResult(road) {
      this.$refs.leafletMap?.focusRoad(road.id)
      this.searchResults = []
    },
    async prepareLocationAccess() {
      if (!navigator.geolocation) {
        this.$emit('notify', 'Browser tidak mendukung akses lokasi')
        return
      }

      if (!navigator.permissions?.query) {
        this.locationPromptOpen = true
        return
      }

      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' })
        if (permission.state === 'granted') {
          this.requestLocation()
        } else {
          this.locationPromptOpen = true
        }
      } catch (error) {
        this.locationPromptOpen = true
      }
    },
    requestLocation() {
      this.$refs.leafletMap?.locateMe()
    },
    handleLocationFound() {
      this.locationPromptOpen = false
    },
    handleLocationError(error) {
      if (error?.code === 1) {
        this.locationPromptOpen = true
        return
      }
      this.$emit('notify', 'Lokasi perangkat tidak tersedia')
    },
  },
}
</script>
