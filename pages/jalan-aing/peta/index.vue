<template>
  <main class="ja-map-page">
    <JalanAingHeader active="peta" />

    <section class="ja-map-shell" aria-label="Peta interaktif Jalan Aing">
      <JalanAingLayerPanel
        class="ja-map-layer-card"
        :mobile-open="mobileLayerOpen"
        :layer-visibility="layerVisibility"
        :filter-status="filterStatus"
        :data-availability="dataAvailability"
        @toggle-layer="toggleLayer"
        @update-filter="updateFilter"
        @close="mobileLayerOpen = false"
      />
      <div class="ja-map-canvas">
        <JalanAingLeafletMap
          ref="leafletMap"
          class="ja-map-leaflet"
          :map-center="mapCenter"
          :map-zoom="mapZoom"
          :complaint-location="complaintLocation"
          :search-location="searchLocation"
          basemap="cartoLight"
          :layer-visibility="layerVisibility"
          :filter-status="filterStatus"
          @select-marker="selectMarker"
          @create-complaint="selectComplaintLocation"
          @data-status="updateDataAvailability"
        />
        <div class="ja-map-search" role="search" :class="{ 'is-searching': searching }" :aria-busy="searching">
          <span class="ja-map-search-icon"><Icon name="magnifier" size="16px" aria-hidden="true" /></span>
          <input v-model.trim="searchQuery" type="search" aria-label="Cari lokasi" placeholder="Cari nama jalan, tempat, atau area" @input="queueSearch" />
          <button v-if="searchQuery" class="ja-map-search-clear" type="button" aria-label="Hapus pencarian" @click="clearSearch"><Icon name="times" size="13px" aria-hidden="true" /></button>
          <span v-if="searching" class="ja-map-search-status"><i aria-hidden="true" />Mencari</span>
        </div>
        <div v-if="searchResults.length || searchMessage" class="ja-map-search-results" aria-live="polite">
          <p v-if="searchResults.length" class="ja-map-search-results-label">Pilih lokasi</p>
          <button v-for="place in searchResults" :key="place.place_id" type="button" @click="focusPlace(place)"><i class="ja-map-search-result-dot" aria-hidden="true" /><span><strong>{{ place.name }}</strong><span>{{ place.display_name }}</span></span></button>
          <p v-if="searchMessage">{{ searchMessage }}</p>
        </div>
        <aside
          v-if="selectedMarker"
          class="ja-map-detail-card"
          aria-live="polite"
        >
          <button
            type="button"
            class="ja-map-detail-close"
            aria-label="Tutup detail"
            @click="selectedMarker = null"
          >
            <Icon name="times" size="16px" />
          </button>
          <p class="ja-map-detail-type">{{ selectedMarker.type }}</p>
          <h2>{{ selectedMarker.label }}</h2>
          <dl v-if="selectedMarkerDetails.length">
            <div v-for="detail in selectedMarkerDetails" :key="detail[0]">
              <dt>{{ detail[0] }}</dt>
              <dd>{{ detail[1] }}</dd>
            </div>
          </dl>
        </aside>
        <aside
          v-else-if="complaintLocation"
          class="ja-map-detail-card ja-map-complaint-card"
          aria-live="polite"
        >
          <button
            type="button"
            class="ja-map-detail-close"
            aria-label="Batal pilih titik"
            @click="complaintLocation = null"
          >
            <Icon name="times" size="16px" />
          </button>
          <p class="ja-map-detail-type">Titik pilihan</p>
          <h2>Laporkan kondisi jalan di sini.</h2>
          <p class="ja-map-coordinate">
            {{ complaintLocation.lat.toFixed(5) }}° LS,
            {{ complaintLocation.lng.toFixed(5) }}° BT
          </p>
          <button
            type="button"
            class="ja-map-report-button"
            @click="openComplaintForm"
          >
            Lanjutkan aduan <span aria-hidden="true">→</span>
          </button>
        </aside>
        <button
          type="button"
          class="ja-map-mobile-layers"
          aria-label="Buka layer dan legenda"
          @click="mobileLayerOpen = true"
        >
          <Icon name="filter" size="18px" /><span>Layer & legenda</span>
        </button>
      </div>
    </section>
  </main>
</template>

<script>
import { searchMapSources } from '~/utils/jalan-aing-map-search'

export default {
  name: 'JalanAingMapPage',
  data() {
    return {
      mobileLayerOpen: false,
      mapCenter: [-6.9025, 107.6187],
      mapZoom: 16,
      layerVisibility: {
        bus: true,
        busStops: true,
        ruasJalan: true,
        rumahSakit: true,
        puskesmas: true,
        restArea: true,
      },
      dataAvailability: {
        bus: true,
        busStops: true,
        ruasJalan: true,
        rumahSakit: true,
        puskesmas: true,
        restArea: true,
      },
      filterStatus: { roadClass: 'semua' },
      selectedMarker: null,
      complaintLocation: null,
      searchLocation: null,
      searchQuery: '',
      searchResults: [],
      searchMessage: '',
      searching: false,
      searchTimer: null,
      searchRequestId: 0,
    }
  },
  head() {
    return { title: 'Peta Interaktif — Jalan Aing' }
  },
  computed: {
    selectedMarkerDetails() {
      return Object.entries(this.selectedMarker?.properties || {})
        .filter(([, value]) => value !== null && value !== '')
        .slice(0, 7)
    },
  },
  beforeDestroy() {
    window.clearTimeout(this.searchTimer)
  },
  methods: {
    toggleLayer({ id, value }) {
      if (id in this.layerVisibility) this.layerVisibility[id] = value
    },
    updateFilter({ key, value }) {
      if (key in this.filterStatus) this.filterStatus[key] = value
    },
    updateDataAvailability(payload) {
      this.dataAvailability = { ...this.dataAvailability, ...payload }
    },
    selectMarker(marker) {
      this.selectedMarker = marker
      this.complaintLocation = null
      this.searchLocation = null
    },
    selectComplaintLocation(location) {
      this.complaintLocation = location
      this.selectedMarker = null
      this.searchLocation = null
    },
    openComplaintForm() {
      this.$router.push({
        path: '/jalan-aing/aduan',
        query: { ...this.complaintLocation, category: this.$route.query.category },
      })
    },
    queueSearch() {
      window.clearTimeout(this.searchTimer)
      this.searchMessage = ''
      this.searchResults = []
      if (this.searchQuery.length < 3) return
      this.searchTimer = window.setTimeout(() => this.searchPlaces(), 450)
    },
    clearSearch() {
      window.clearTimeout(this.searchTimer)
      this.searchRequestId += 1
      this.searchQuery = ''
      this.searchResults = []
      this.searchMessage = ''
      this.searching = false
      this.searchLocation = null
    },
    async searchPlaces() {
      if (this.searchQuery.length < 3) return
      const requestId = ++this.searchRequestId
      this.searching = true
      try {
        const { results, available } = await searchMapSources(this.searchQuery)
        if (requestId !== this.searchRequestId) return
        this.searchResults = results
        if (!results.length) this.searchMessage = available ? 'Lokasi tidak ditemukan.' : 'Pencarian lokasi belum tersedia.'
      } catch (error) {
        if (requestId === this.searchRequestId) this.searchMessage = 'Pencarian lokasi belum tersedia.'
      } finally {
        if (requestId === this.searchRequestId) this.searching = false
      }
    },
    focusPlace(place) {
      this.selectedMarker = null
      this.complaintLocation = null
      this.searchLocation = { lat: Number(place.lat), lng: Number(place.lon), label: place.name }
      this.$refs.leafletMap?.focusLocation(this.searchLocation)
      this.searchResults = []
      this.searchMessage = ''
    },
  },
}
</script>

<style scoped>
.ja-map-page {
  --ja-map-ink: #14233f;
  --ja-map-paper: #fffefb;
  --ja-map-rule: #dce7e0;
  --ja-map-green-dark: #0d6d43;
  --ja-map-yellow: #ffcf51;
  min-height: 100vh;
  overflow: hidden;
  background: var(--ja-map-paper);
  color: var(--ja-map-ink);
  font-family: Roboto, sans-serif;
}
.ja-map-header {
  position: relative;
  z-index: 900;
  display: flex;
  min-height: 76px;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(20px, 4vw, 48px);
  border-bottom: 1px solid var(--ja-map-rule);
  background: var(--ja-map-paper);
}
.ja-map-brand,
.ja-map-nav {
  display: flex;
  align-items: center;
}
.ja-map-brand {
  gap: 10px;
  color: var(--ja-map-ink);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.11em;
  line-height: 1.08;
  text-decoration: none;
  text-transform: uppercase;
}
.ja-map-brand-mark {
  width: 44px;
  height: 44px;
}
.ja-map-nav {
  gap: 30px;
}
.ja-map-nav a,
.ja-map-help {
  color: #505867;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}
.ja-map-nav a:hover,
.ja-map-nav a[aria-current='page'],
.ja-map-help:hover {
  color: var(--ja-map-green-dark);
}
.ja-map-nav a:focus-visible,
.ja-map-help:focus-visible,
.ja-map-mobile-layers:focus-visible {
  outline: 3px solid var(--ja-map-yellow);
  outline-offset: 3px;
}
.ja-map-shell {
  position: relative;
  height: calc(100vh - 76px);
  height: calc(100svh - 76px);
  min-height: 540px;
}
.ja-map-canvas {
  position: relative;
  width: 100%;
  height: 100%;
}
.ja-map-mobile-layers {
  display: none;
}
.ja-map-search {
  --ja-map-search-muted: #6f7785;
  position: absolute;
  top: 20px;
  left: 50%;
  z-index: 600;
  display: flex;
  width: min(400px, calc(100% - 440px));
  min-width: 260px;
  min-height: 46px;
  align-items: center;
  gap: 10px;
  padding: 0 13px;
  border: 1px solid #d9dde4;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(20, 35, 63, 0.12);
  color: var(--ja-map-search-muted);
  transform: translateX(-50%);
}
.ja-map-search-icon {
  display: grid;
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  place-items: center;
  color: #465064;
}
.ja-map-search input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ja-map-ink);
  font: inherit;
  font-size: 13px;
  font-weight: 400;
}
.ja-map-search input::placeholder { color: #8791a3; }
.ja-map-search-clear {
  display: grid;
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #eef1f4;
  color: #596273;
  cursor: pointer;
}
.ja-map-search-clear:hover { background: #e1e5ea; }
.ja-map-search-clear:focus-visible { outline: 2px solid var(--ja-map-yellow); outline-offset: 2px; }
.ja-map-search-status {
  flex: 0 0 auto;
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
}
.ja-map-search-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #465064;
}
.ja-map-search-status i {
  width: 8px;
  height: 8px;
  border: 2px solid #d5d9e1;
  border-top-color: #465064;
  border-radius: 999px;
  animation: ja-map-search-spin 0.7s linear infinite;
}
.ja-map-search:focus-within {
  border-color: #7b8595;
  box-shadow: 0 0 0 3px rgba(70, 80, 100, 0.14), 0 6px 20px rgba(20, 35, 63, 0.12);
}
.ja-map-search input:focus-visible { outline: 0; }
.ja-map-search-results {
  position: absolute;
  top: 74px;
  left: 50%;
  z-index: 600;
  width: min(400px, calc(100% - 440px));
  min-width: 260px;
  overflow: hidden;
  border: 1px solid #d9dde4;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 10px 26px rgba(20, 35, 63, 0.14);
  transform: translateX(-50%);
}
.ja-map-search-results-label {
  margin: 0;
  padding: 10px 13px 7px;
  color: #596273;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.ja-map-search-results button {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  padding: 9px 13px;
  border: 0;
  border-bottom: 1px solid var(--ja-map-rule);
  background: transparent;
  color: var(--ja-map-ink);
  cursor: pointer;
  text-align: left;
}
.ja-map-search-results button:hover,
.ja-map-search-results button:focus-visible { background: #f5f7f9; }
.ja-map-search-results button:focus-visible { outline: 2px solid var(--ja-map-yellow); outline-offset: -2px; }
.ja-map-search-result-dot {
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  margin-top: 4px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #58657a;
  box-shadow: 0 0 0 1px #c4cad4;
}
.ja-map-search-results strong,
.ja-map-search-results span { display: block; }
.ja-map-search-results strong { font-size: 12px; }
.ja-map-search-results span,
.ja-map-search-results p {
  margin: 3px 0 0;
  color: #68758a;
  font-size: 11px;
  line-height: 1.35;
}
.ja-map-search-results p:not(.ja-map-search-results-label) { padding: 12px 13px; }
@keyframes ja-map-search-spin { to { transform: rotate(360deg); } }
.ja-map-detail-card {
  position: absolute;
  z-index: 650;
  right: clamp(20px, 3vw, 48px);
  bottom: 24px;
  width: min(360px, calc(100% - 40px));
  padding: 22px;
  border: 1px solid rgba(220, 231, 224, 0.96);
  border-radius: 22px;
  background: rgba(255, 254, 251, 0.96);
  box-shadow: 0 18px 42px rgba(20, 35, 63, 0.16),
    0 3px 10px rgba(20, 35, 63, 0.08);
  backdrop-filter: blur(16px);
}
.ja-map-detail-card h2 {
  max-width: 290px;
  margin: 4px 32px 0 0;
  color: var(--ja-map-ink);
  font-size: 20px;
  font-weight: 800;
  line-height: 1.18;
}
.ja-map-detail-type {
  margin: 0;
  color: var(--ja-map-green-dark);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.ja-map-detail-close {
  position: absolute;
  top: 14px;
  right: 14px;
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: #edf4ef;
  color: #505867;
  cursor: pointer;
}
.ja-map-detail-close:hover {
  background: #dcece1;
  color: var(--ja-map-green-dark);
}
.ja-map-detail-card dl {
  margin: 18px 0 0;
  padding: 12px;
  border: 1px solid var(--ja-map-rule);
  border-radius: 14px;
  background: rgba(247, 250, 248, 0.9);
}
.ja-map-detail-card dl div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 7px 0;
  border-bottom: 1px solid var(--ja-map-rule);
  color: #59667c;
  font-size: 12px;
  line-height: 1.35;
}
.ja-map-detail-card dl div:last-child {
  border-bottom: 0;
}
.ja-map-detail-card dt {
  font-weight: 700;
}
.ja-map-detail-card dd {
  margin: 0;
  text-align: right;
}
.ja-map-coordinate {
  margin: 16px 0 0;
  color: #59667c;
  font-size: 13px;
  font-weight: 700;
}
.ja-map-report-button {
  display: flex;
  width: 100%;
  min-height: 48px;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding: 0 16px;
  border: 0;
  border-radius: 12px;
  background: var(--ja-map-green-dark);
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}
.ja-map-report-button:hover {
  background: #095b38;
}
.ja-map-detail-close:focus-visible,
.ja-map-report-button:focus-visible {
  outline: 3px solid var(--ja-map-yellow);
  outline-offset: 3px;
}
@media (min-width: 768px) {
  .ja-map-layer-card {
    position: absolute !important;
    z-index: 700;
    top: 36px;
    bottom: 36px;
    left: clamp(20px, 3vw, 40px);
    width: min(360px, calc(100% - 64px)) !important;
    height: auto !important;
    border: 1px solid rgba(220, 231, 224, 0.96) !important;
    border-radius: 18px !important;
    background: rgba(255, 254, 251, 0.96) !important;
    box-shadow: 0 18px 42px rgba(20, 35, 63, 0.14),
      0 3px 10px rgba(20, 35, 63, 0.07) !important;
    backdrop-filter: blur(16px);
  }
}
@media (min-width: 768px) and (max-width: 1280px),
  (min-width: 768px) and (max-height: 800px) {
  .ja-map-header {
    min-height: 64px;
    padding: 0 28px;
  }
  .ja-map-brand {
    gap: 8px;
    font-size: 10px;
  }
  .ja-map-brand-mark {
    width: 38px;
    height: 38px;
  }
  .ja-map-nav {
    gap: 22px;
  }
  .ja-map-nav a,
  .ja-map-help {
    font-size: 13px;
  }
  .ja-map-shell {
    height: calc(100vh - 64px);
    height: calc(100svh - 64px);
  }
  .ja-map-layer-card {
    top: 22px;
    bottom: 22px;
    left: 24px;
    width: min(320px, calc(100% - 48px)) !important;
    border-radius: 14px !important;
  }
  .ja-map-detail-card {
    right: 22px;
    bottom: 18px;
    width: min(310px, calc(100% - 44px));
    padding: 16px;
    border-radius: 16px;
  }
  .ja-map-detail-card h2 {
    max-width: 250px;
    font-size: 17px;
  }
  .ja-map-detail-type {
    font-size: 10px;
  }
  .ja-map-detail-card dl {
    margin-top: 12px;
    padding: 9px;
    border-radius: 10px;
  }
  .ja-map-detail-card dl div {
    gap: 10px;
    padding: 5px 0;
    font-size: 11px;
  }
  .ja-map-coordinate {
    margin-top: 12px;
    font-size: 12px;
  }
  .ja-map-report-button {
    min-height: 40px;
    margin-top: 14px;
    padding: 0 12px;
    border-radius: 9px;
    font-size: 12px;
  }
  .ja-map-detail-close {
    top: 10px;
    right: 10px;
    width: 28px;
    height: 28px;
  }
  ::v-deep(.ja-map-layer-card > div:first-child) {
    padding: 12px;
  }
  ::v-deep(.ja-map-layer-card h2) {
    font-size: 16px;
  }
  ::v-deep(.ja-map-layer-card > .flex > section) {
    padding: 5px;
  }
  ::v-deep(.ja-map-layer-card section > button) {
    padding: 7px 8px;
    font-size: 13px;
  }
  ::v-deep(.ja-map-layer-card .border-l) {
    margin-left: 10px;
    gap: 7px;
    padding-bottom: 8px;
    padding-left: 10px;
    padding-right: 0;
  }
  ::v-deep(.ja-map-layer-card .text-sm) {
    font-size: 12px;
  }
  ::v-deep(.ja-map-layer-card .text-xs) {
    font-size: 10px;
  }
  ::v-deep(.ja-map-layer-card > .border-t) {
    padding: 12px;
  }
  ::v-deep(.ja-map-leaflet .right-4.top-5) {
    top: 14px;
    right: 14px;
    gap: 6px;
  }
  ::v-deep(.ja-map-leaflet .h-10.w-10) {
    width: 34px;
    height: 34px;
    border-radius: 10px;
  }
}
@media (max-width: 820px) {
  .ja-map-nav {
    display: none;
  }
}
@media (max-width: 640px) {
  .ja-map-header {
    min-height: 64px;
  }
  .ja-map-brand {
    font-size: 10px;
  }
  .ja-map-brand-mark {
    width: 36px;
    height: 36px;
  }
  .ja-map-help {
    font-size: 12px;
  }
  .ja-map-shell {
    height: calc(100svh - 128px);
    min-height: 540px;
  }
  .ja-map-search {
    top: 16px;
    left: 16px;
    width: calc(100% - 32px);
    min-width: 0;
    transform: none;
  }
  .ja-map-search-results {
    top: 70px;
    left: 16px;
    width: calc(100% - 32px);
    min-width: 0;
    transform: none;
  }
  .ja-map-detail-card {
    right: 16px;
    bottom: 16px;
    width: calc(100% - 32px);
  }
  .ja-map-complaint-card {
    padding: 16px;
    border-radius: 18px;
  }
  .ja-map-complaint-card h2 {
    margin-top: 3px;
    font-size: 18px;
    line-height: 1.22;
  }
  .ja-map-complaint-card .ja-map-detail-type {
    font-size: 10px;
    letter-spacing: 0.1em;
  }
  .ja-map-complaint-card .ja-map-coordinate {
    display: inline-flex;
    margin-top: 10px;
    padding: 6px 8px;
    border-radius: 8px;
    background: #f3f8f5;
    font-size: 12px;
  }
  .ja-map-complaint-card .ja-map-report-button {
    min-height: 44px;
    margin-top: 14px;
    padding: 0 14px;
    border-radius: 10px;
    font-size: 13px;
  }
  .ja-map-mobile-layers {
    position: absolute;
    right: auto;
    bottom: 78px;
    left: 16px;
    z-index: 600;
    display: grid;
    width: 46px;
    min-height: 46px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 14px;
    background: var(--ja-map-paper);
    color: var(--ja-map-ink);
    font: inherit;
    font-size: 13px;
    font-weight: 700;
    box-shadow: 0 10px 24px rgba(20, 35, 63, 0.16);
  }
  .ja-map-mobile-layers > span { display: none; }
  ::v-deep(.ja-map-leaflet .right-4.top-5) { top: 76px; right: 16px; gap: 8px; }
  ::v-deep(.ja-map-leaflet .h-10.w-10) { width: 42px; height: 42px; border-radius: 12px; }
}
</style>
