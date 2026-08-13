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
        <input v-model="searchQuery" type="search" aria-label="Cari lokasi" placeholder="Cari jalan provinsi..." class="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400">
      </form>
      <div v-if="searchResults.length" class="absolute left-4 right-4 top-20 z-[600] max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        <button v-for="road in searchResults" :key="road.id" type="button" class="block w-full border-b border-slate-100 px-4 py-3 text-left text-sm last:border-b-0 hover:bg-jalan-aing-primary-soft" @click="selectSearchResult(road)">
        <span class="block font-bold text-slate-800">{{ road.name }}</span><span class="text-xs text-slate-500">{{ road.city || 'Jalan Provinsi' }}</span>
        </button>
      </div>

      <div v-if="selectedMarker" class="absolute bottom-4 left-4 right-4 z-[600] max-w-sm rounded-3xl border border-slate-200 bg-white/95 p-5 text-slate-800 shadow-2xl backdrop-blur-lg">
      <div class="flex items-start justify-between gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">{{ selectedMarker.type }}</span>
          <h3 class="mt-1 text-sm font-bold">{{ selectedMarker.label }}</h3>
        </div>
        <button type="button" class="text-slate-500 hover:text-slate-700" aria-label="Tutup detail marker" @click="closeMarker"><Icon name="times" size="16px" /></button>
      </div>
      <dl v-if="selectedMarkerDetails.length" class="mt-3 space-y-1 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
        <div v-for="detail in selectedMarkerDetails" :key="detail[0]" class="flex justify-between gap-3 border-b border-slate-200 py-1 last:border-0">
          <dt class="font-bold">{{ detail[0] }}</dt><dd class="text-right">{{ detail[1] }}</dd>
        </div>
      </dl>
      <div v-if="selectedMarker.shelterId" class="mt-3 rounded-2xl border border-sky-100 bg-sky-50 p-3 text-xs text-slate-600">
        <p class="font-bold text-slate-700">Bus menuju halte</p>
        <div v-if="shelterBusesLoading" class="mt-3 space-y-2" role="status" aria-label="Memuat posisi bus">
          <article v-for="index in 2" :key="index" class="rounded-xl border border-sky-100 bg-white px-3 py-2.5">
            <div class="flex items-center justify-between gap-3"><span class="jalan-aing-skeleton h-3 w-28 rounded" /><span class="jalan-aing-skeleton h-3 w-14 rounded" /></div>
            <span class="jalan-aing-skeleton mt-3 block h-3 w-4/5 rounded" />
            <span class="jalan-aing-skeleton mt-2 block h-3 w-3/5 rounded" />
            <span class="jalan-aing-skeleton mt-3 block h-2.5 w-2/3 rounded" />
          </article>
        </div>
        <p v-else-if="!selectedMarker.buses?.length" class="mt-2">Belum ada bus menuju halte ini.</p>
        <div v-else class="mt-3 max-h-[24rem] space-y-2 overflow-y-auto overscroll-contain pr-1">
          <article v-for="bus in selectedMarker.buses" :key="bus.id" class="rounded-xl border border-sky-100 bg-white px-3 py-2.5 shadow-sm">
            <div class="flex items-start justify-between gap-2">
              <p class="font-bold text-slate-800">{{ bus.name || 'Bus' }} <span class="ml-1 rounded-md bg-sky-100 px-1.5 py-0.5 text-[10px] text-sky-800">{{ bus.kor || '—' }}</span></p>
              <span class="shrink-0 text-slate-500">{{ bus.plate_number || '—' }}</span>
            </div>
            <p class="mt-1 text-slate-700">{{ bus.origin || '—' }} <span class="px-1 text-sky-600">→</span> {{ bus.toward || '—' }}</p>
            <div class="mt-2 flex items-center gap-2 border-y border-slate-100 py-1.5 font-semibold text-slate-600"><span>{{ bus.speed || 0 }} km/jam</span><span class="h-1 w-1 rounded-full bg-slate-300" /><span>ETA {{ bus.eta ?? '—' }} menit</span></div>
            <p class="mt-2"><span class="font-semibold text-slate-700">Posisi terakhir:</span> {{ bus.ns_name || '—' }}</p>
            <p class="mt-0.5 text-[11px] text-slate-400">{{ bus.dt_server || '—' }}</p>
          </article>
        </div>
      </div>
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
      shelterBusesTimer: null,
      shelterBusesLoading: false,
      shelterBusesInFlight: false,
    }
  },
  computed: {
    selectedMarkerDetails() {
      return Object.entries(this.selectedMarker?.properties || {}).filter(([, value]) => value !== null && value !== '').slice(0, 6)
    },
  },
  mounted() {
    this.locationPromptTimer = window.setTimeout(() => this.prepareLocationAccess(), 450)
  },
  beforeDestroy() {
    window.clearTimeout(this.locationPromptTimer)
    window.clearInterval(this.shelterBusesTimer)
  },
  methods: {
    selectMarker(marker) {
      window.clearInterval(this.shelterBusesTimer)
      this.selectedMarker = marker
      if (marker.shelterId) {
        this.loadShelterBuses()
        this.shelterBusesTimer = window.setInterval(() => this.loadShelterBuses(), 10000)
      }
    },
    closeMarker() {
      window.clearInterval(this.shelterBusesTimer)
      this.selectedMarker = null
    },
    async loadShelterBuses() {
      const shelterId = this.selectedMarker?.shelterId
      if (!shelterId || this.shelterBusesInFlight) return
      this.shelterBusesInFlight = true
      this.shelterBusesLoading = !this.selectedMarker.buses
      try {
        const response = await fetch(`/api/jalan-aing/buses?shelterId=${encodeURIComponent(shelterId)}`)
        const payload = await response.json()
        if (!response.ok || !Array.isArray(payload.data)) throw new Error('Data bus halte tidak tersedia')
        if (this.selectedMarker?.shelterId === shelterId) {
          this.$set(this.selectedMarker, 'buses', payload.data)
        }
      } catch (error) {
        if (this.selectedMarker?.shelterId === shelterId) this.$set(this.selectedMarker, 'buses', [])
      } finally {
        this.shelterBusesLoading = false
        this.shelterBusesInFlight = false
      }
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

<style scoped>
.jalan-aing-skeleton {
  background: linear-gradient(100deg, #e2e8f0 35%, #f8fafc 50%, #e2e8f0 65%);
  background-size: 200% 100%;
  animation: jalan-aing-skeleton-shimmer 1.8s ease-in-out infinite;
}

@keyframes jalan-aing-skeleton-shimmer {
  to { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .jalan-aing-skeleton { animation: none; }
}
</style>
