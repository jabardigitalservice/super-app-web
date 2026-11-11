<template>
  <main class="ja-map-page" :class="{ 'is-hospital-mode': hospitalMode }">
    <JalanAingHeader active="peta" />

    <section
      class="ja-map-shell"
      :class="{
        'is-sidebar-collapsed': sidebarCollapsed,
        'is-route-mode': routeMode,
      }"
      aria-label="Peta interaktif Jalan Aing"
    >
      <div
        id="ja-map-sidebar"
        class="ja-map-sidebar"
        :aria-hidden="String(sidebarCollapsed)"
        @transitionend.self="refreshMapSize"
      >
        <div v-show="!routeMode" class="ja-map-sidebar-top">
          <div
            class="ja-map-search"
            role="search"
            :class="{ 'is-searching': searching, 'has-query': searchQuery }"
            :aria-busy="searching"
          >
            <span class="ja-map-search-icon"
              ><Icon name="magnifier" size="18px" aria-hidden="true"
            /></span>
            <input
              ref="searchInput"
              v-model.trim="searchQuery"
              type="search"
              role="combobox"
              :aria-label="
                hospitalMode
                  ? 'Cari nama rumah sakit dan puskesmas'
                  : 'Cari lokasi'
              "
              aria-autocomplete="list"
              :aria-controls="
                searchResults.length ? 'ja-map-search-results' : undefined
              "
              :aria-expanded="String(Boolean(searchResults.length))"
              :aria-activedescendant="
                activeSearchIndex >= 0
                  ? `ja-map-search-result-${activeSearchIndex}`
                  : undefined
              "
              :placeholder="
                hospitalMode
                  ? 'Cari fasilitas kesehatan'
                  : 'Cari lokasi, halte, atau fasilitas'
              "
              @focus="prefetchSearchData"
              @input="queueSearch($event.target.value)"
              @keydown="handleSearchKeydown"
            />
            <button
              v-if="searchQuery"
              class="ja-map-search-clear"
              type="button"
              aria-label="Hapus pencarian"
              @click="clearSearch"
            >
              <Icon name="times" size="13px" aria-hidden="true" />
            </button>
            <button
              type="button"
              class="ja-map-route-open"
              aria-label="Cari rute"
              @click="openRoute()"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                <path d="M18 9V5" />
                <path d="M15 5h6" />
                <path d="M6 15V9a4 4 0 0 1 4-4h1" />
                <path d="M18 9v4a4 4 0 0 1-4 4h-4" />
              </svg>
              <span>Rute</span>
            </button>
            <span
              v-if="searching"
              class="ja-map-search-progress"
              aria-hidden="true"
            />
            <span
              v-if="searching"
              class="ja-map-search-loading-text"
              role="status"
              >Mencari lokasi…</span
            >
          </div>
          <div
            v-if="
              searchResults.length ||
              searchMessage ||
              (searchQuery.length >= 3 && datasetsLoading && !searchLocation)
            "
            id="ja-map-search-results"
            class="ja-map-search-results"
            :role="searchResults.length ? 'listbox' : undefined"
            aria-live="polite"
          >
            <template v-for="group in searchGroups">
              <p
                :key="`label-${group.rank}`"
                class="ja-map-search-results-label"
              >
                {{ group.label }}
              </p>
              <button
                v-for="{ place, index } in group.items"
                :id="`ja-map-search-result-${index}`"
                :key="place.place_id"
                type="button"
                role="option"
                :aria-selected="activeSearchIndex === index"
                :class="{ 'is-active': activeSearchIndex === index }"
                @mouseenter="activeSearchIndex = index"
                @click="focusPlace(place)"
              >
                <span class="ja-map-search-result-text"
                  ><strong>{{ place.name }}</strong
                  ><span>{{ place.display_name }}</span></span
                >
                <em
                  v-if="place.source === 'dataset' && !place.active"
                  class="ja-map-search-result-tag"
                  >Tampilkan</em
                >
              </button>
            </template>
            <p v-if="searchMessage">{{ searchMessage }}</p>
            <p
              v-if="searchQuery.length >= 3 && datasetsLoading"
              class="ja-map-search-pending"
            >
              Masih memuat data Jalan Aing, hasil akan bertambah…
            </p>
          </div>
        </div>
        <JalanAingRoutePanel
          v-if="routeMode"
          :from="routeFrom"
          :to="routeTo"
          :pick-field="routePickField"
          :user-location="userLocation"
          :search-places="searchRoutePlaces"
          :journey="journey"
          :selected="journeySelected"
          :preview-key="journeyPreviewKey"
          :location-loading="Boolean(pendingLocationField)"
          :nearest-loading="nearestLoading"
          :nearest-error="nearestError"
          @set-point="setRoutePoint"
          @swap="swapRoute"
          @pick-on-map="routePickField = $event"
          @use-my-location="useMyLocationFor"
          @nearest="routeToNearest"
          @select-option="selectJourneyOption"
          @back-to-list="journeySelected = null"
          @focus-point="focusRoutePoint"
          @report="reportAt"
          @close="closeRoute"
        />
        <JalanAingLayerPanel
          v-show="!routeMode"
          class="ja-map-layer-card"
          :mobile-open="mobileLayerOpen"
          :hospital-mode="hospitalMode"
          :layer-visibility="layerVisibility"
          :filter-status="filterStatus"
          :data-availability="dataAvailability"
          :layer-loading="layerLoading"
          :legend-colors="legendColors"
          @toggle-layer="toggleLayer"
          @update-filter="updateFilter"
          @reset-layers="resetLayers"
          @close="mobileLayerOpen = false"
        />
      </div>
      <div class="ja-map-canvas">
        <JalanAingLeafletMap
          ref="leafletMap"
          class="ja-map-leaflet"
          :map-zoom="mapZoom"
          :complaint-location="complaintLocation"
          :search-location="searchLocation"
          :basemap="basemap"
          :layer-visibility="layerVisibility"
          :filter-status="filterStatus"
          @select-marker="selectMarker"
          @create-complaint="selectComplaintLocation"
          @data-status="updateDataAvailability"
          @loading-status="updateLayerLoading"
          @legend-colors="updateLegendColors"
          @location-found="onLocationFound"
          @location-error="onLocationError"
        />
        <button
          type="button"
          class="ja-map-fold"
          aria-controls="ja-map-sidebar"
          :aria-expanded="String(!sidebarCollapsed)"
          :aria-label="sidebarCollapsed ? 'Buka panel' : 'Tutup panel'"
          @click="sidebarCollapsed = !sidebarCollapsed"
        >
          <Icon
            :name="sidebarCollapsed ? 'chevron-right' : 'chevron-left'"
            size="16px"
            aria-hidden="true"
          />
        </button>
        <div
          v-show="!routeMode"
          class="ja-map-chips"
          role="group"
          aria-label="Layer cepat"
        >
          <button
            v-for="chip in quickLayers"
            :key="chip.id"
            type="button"
            class="ja-map-chip"
            :class="{
              'is-on': layerVisibility[chip.id],
              'is-loading': layerLoading[chip.id] && layerVisibility[chip.id],
              'is-unavailable': !dataAvailability[chip.id],
            }"
            :title="
              dataAvailability[chip.id]
                ? undefined
                : 'Gagal dimuat, klik untuk coba lagi'
            "
            :aria-pressed="String(Boolean(layerVisibility[chip.id]))"
            @click="
              toggleLayer({ id: chip.id, value: !layerVisibility[chip.id] })
            "
          >
            {{ chip.label }}
          </button>
        </div>
        <div class="ja-map-basemaps" role="group" aria-label="Jenis peta">
          <button
            v-for="option in basemapOptions"
            :key="option.id"
            type="button"
            class="ja-map-basemap"
            :class="{ 'is-on': basemap === option.id }"
            :aria-pressed="String(basemap === option.id)"
            @click="basemap = option.id"
          >
            <img :src="option.thumb" alt="" loading="lazy" />
            <span>{{ option.label }}</span>
          </button>
        </div>
        <transition name="ja-map-notice">
          <p v-if="locationError" class="ja-map-location-error" role="status">
            <Icon
              name="info-circle-outline"
              size="18px"
              aria-hidden="true"
            /><span>{{ locationError }}</span>
          </p>
        </transition>
        <transition name="ja-sheet" mode="out-in">
        <aside
          v-if="selectedMarker"
          key="marker"
          class="ja-map-detail-card ja-map-marker-card"
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
          <div
            v-if="routeMode && Number.isFinite(selectedMarker.lat)"
            class="ja-map-route-set"
          >
            <button type="button" @click="useMarkerFor('from')">
              Jadikan titik awal
            </button>
            <button type="button" class="is-primary" @click="useMarkerFor('to')">
              Jadikan tujuan
            </button>
          </div>
          <button
            v-else-if="Number.isFinite(selectedMarker.lat)"
            type="button"
            class="ja-map-route-here"
            @click="
              openRoute({
                lat: selectedMarker.lat,
                lng: selectedMarker.lng,
                label: selectedMarker.label,
              })
            "
          >
            Rute ke sini <span aria-hidden="true">→</span>
          </button>
        </aside>
        <aside
          v-else-if="searchLocation && !routeMode"
          key="place"
          class="ja-map-detail-card ja-map-place-card"
          aria-live="polite"
        >
          <button
            type="button"
            class="ja-map-detail-close"
            aria-label="Tutup hasil pencarian"
            @click="searchLocation = null"
          >
            <Icon name="times" size="16px" />
          </button>
          <p class="ja-map-detail-type">Hasil pencarian</p>
          <h2>{{ searchLocation.label }}</h2>
          <button
            type="button"
            class="ja-map-report-button"
            @click="openRoute({ ...searchLocation })"
          >
            Rute ke sini <span aria-hidden="true">→</span>
          </button>
        </aside>
        <aside
          v-else-if="complaintLocation && !routeMode"
          key="complaint"
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
            {{ Math.abs(complaintLocation.lat).toFixed(5) }}°
            {{ complaintLocation.lat < 0 ? 'LS' : 'LU' }},
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
        </transition>
        <button
          type="button"
          class="ja-map-mobile-layers"
          aria-label="Buka layer dan legenda"
          :aria-expanded="String(mobileLayerOpen)"
          @click="mobileLayerOpen = true"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.9"
            aria-hidden="true"
          >
            <path d="m3 8 9-5 9 5-9 5-9-5Z" />
            <path d="m3 12 9 5 9-5" />
            <path d="m3 16 9 5 9-5" />
          </svg>
          <span>Layer</span>
          <span v-if="activeLayerCount" class="ja-map-mobile-layers-count">{{
            activeLayerCount
          }}</span>
        </button>
      </div>
    </section>
  </main>
</template>

<script>
import {
  mapSearchSources,
  searchMapSources,
} from '~/utils/jalan-aing-map-search'
import { isJalanAingLocation } from '~/utils/jalan-aing-location'
import { fetchRoute } from '~/utils/jalan-aing-routing'
import { nearestHalte, planTransit } from '~/utils/jalan-aing-transit'
import { haversine } from '~/utils/jalan-aing-geo'
import {
  analyzeRoute,
  INSIGHT_LAYERS,
} from '~/utils/jalan-aing-route-insights'

export default {
  name: 'JalanAingMapPage',
  data() {
    return {
      mobileLayerOpen: false,
      sidebarCollapsed: false,
      routeMode: false,
      routeFrom: null,
      routeTo: null,
      journey: {
        transit: { status: 'idle', options: [], nearestHalte: null },
        car: { status: 'idle', route: null, insights: null, message: '' },
        walk: { status: 'idle', route: null },
      },
      journeySelected: null,
      nearestLoading: '',
      nearestError: '',
      routePickField: null,
      userLocation: null,
      pendingLocationField: null,
      basemap: 'openFreeMap',
      basemapOptions: [
        {
          id: 'openFreeMap',
          label: 'Peta',
          thumb: 'https://tile.openstreetmap.org/13/6544/4253.png',
        },
        {
          id: 'satellite',
          label: 'Satelit',
          thumb:
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/4253/6544',
        },
        {
          id: 'osm',
          label: 'Detail',
          thumb: 'https://tile.openstreetmap.org/14/13088/8507.png',
        },
      ],
      quickLayerList: [
        { id: 'bus', label: 'Bus real-time', color: '#0EA5E9' },
        { id: 'busStops', label: 'Halte', color: '#2563EB' },
        { id: 'ruasJalan', label: 'Jalan Provinsi', color: '#008444' },
        { id: 'rumahSakit', label: 'Rumah Sakit', color: '#0F766E' },
        { id: 'puskesmas', label: 'Puskesmas', color: '#2563EB' },
        { id: 'restArea', label: 'Rest Area', color: '#D97706' },
        { id: 'apj', label: 'APJ', color: '#F59E0B' },
      ],
      mapZoom: 16,
      layerVisibility: {
        bus: false,
        busStops: false,
        ruasJalan: false,
        rumahSakit: false,
        puskesmas: false,
        restArea: false,
        apj: false,
        bahayaBanjir: false,
        bahayaBanjirBandang: false,
        bahayaCuacaEkstrem: false,
        bahayaGempaBumi: false,
        bahayaKebakaranHutanDanLahan: false,
        bahayaKekeringan: false,
        bahayaTanahLongsor: false,
        bahayaTsunami: false,
        indeksMultibahayaBencana: false,
      },
      dataAvailability: {
        bus: true,
        busStops: true,
        ruasJalan: true,
        rumahSakit: true,
        puskesmas: true,
        restArea: true,
        apj: true,
        bahayaBanjir: true,
        bahayaBanjirBandang: true,
        bahayaCuacaEkstrem: true,
        bahayaGempaBumi: true,
        bahayaKebakaranHutanDanLahan: true,
        bahayaKekeringan: true,
        bahayaTanahLongsor: true,
        bahayaTsunami: true,
        indeksMultibahayaBencana: true,
      },
      layerLoading: {},
      legendColors: {},
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
      activeSearchIndex: -1,
      skipLayerSearch: false,
      locationError: '',
      locationErrorTimer: null,
      documentOverflow: '',
    }
  },
  head() {
    return { title: 'Peta Interaktif — Jalan Aing' }
  },
  computed: {
    journeyPreviewKey() {
      if (this.journeySelected?.type === 'transit')
        return `transit-${this.journeySelected.index}`
      if (this.journeySelected) return this.journeySelected.type
      if (this.journey.transit.options.length) return 'transit-0'
      if (this.journey.car.route) return 'car'
      if (this.journey.walk.route) return 'walk'
      return ''
    },
    activeLayerCount() {
      return Object.values(this.layerVisibility).filter(Boolean).length
    },
    datasetsLoading() {
      const ids = this.hospitalMode
        ? ['rumahSakit', 'puskesmas']
        : ['ruasJalan', 'rumahSakit', 'puskesmas', 'restArea', 'apj']
      return ids.some((id) => this.layerLoading[id])
    },
    searchGroups() {
      const labels = {
        0: 'Layer aktif',
        1: 'Data Jalan Aing',
        2: 'OpenStreetMap',
      }
      const groups = []
      this.searchResults.forEach((place, index) => {
        const rank =
          place.source === 'dataset' ? (place.active ? 0 : 1) : 2
        let group = groups[groups.length - 1]
        if (!group || group.rank !== rank) {
          group = { rank, label: labels[rank], items: [] }
          groups.push(group)
        }
        group.items.push({ place, index })
      })
      return groups
    },
    quickLayers() {
      return this.hospitalMode
        ? this.quickLayerList.filter((chip) =>
            ['rumahSakit', 'puskesmas'].includes(chip.id)
          )
        : this.quickLayerList
    },
    hospitalMode() {
      return this.$route.query.mode === 'rumah-sakit'
    },
    selectedMarkerDetails() {
      const fieldLabels = this.selectedMarker?.fieldLabels || null
      const normaliseKey = (key) => key.toLowerCase().replace(/[^a-z0-9]/g, '')
      const defaultLabel = (key) =>
        key
          .toLowerCase()
          .replace(/_/g, ' ')
          .replace(/^./, (letter) => letter.toUpperCase())

      return Object.entries(this.selectedMarker?.properties || {})
        .filter(([, value]) => value !== null && value !== '')
        .reduce((details, [key, value]) => {
          const normalised = normaliseKey(key)
          const override =
            fieldLabels && normalised in fieldLabels
              ? fieldLabels[normalised]
              : undefined
          // Explicit `null` in a layer's fieldLabels hides the field entirely.
          if (override === null) return details
          // With no per-layer override, OBJECTID stays hidden (legacy default behaviour).
          if (override === undefined && normalised === 'objectid')
            return details
          details.push([override || defaultLabel(key), value])
          return details
        }, [])
        .slice(0, 7)
    },
  },
  watch: {
    routeFrom() {
      this.planJourney()
    },
    routeTo() {
      this.planJourney()
    },
    journeySelected() {
      this.drawJourney(true)
    },
    layerVisibility: {
      deep: true,
      handler() {
        if (this.skipLayerSearch) {
          this.skipLayerSearch = false
          return
        }
        this.searchLocation = null
        this.queueSearch()
      },
    },
    filterStatus: {
      deep: true,
      handler() {
        this.queueSearch()
      },
    },
    hospitalMode: {
      immediate: true,
      handler(value) {
        Object.keys(this.layerVisibility).forEach((id) => {
          this.layerVisibility[id] = value && id === 'rumahSakit'
        })
        this.selectedMarker = null
        this.complaintLocation = null
        this.clearSearch()
      },
    },
  },
  beforeDestroy() {
    this.clearSearch()
    window.clearTimeout(this.searchTimer)
    window.clearTimeout(this.refreshSearchTimer)
    this.routeController?.abort()
    window.clearTimeout(this.locationErrorTimer)
    document.documentElement.style.overflow = this.documentOverflow
  },
  mounted() {
    this.documentOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
  },
  methods: {
    onLocationFound(latlng) {
      this.userLocation = { lat: latlng.lat, lng: latlng.lng }
      if (this.pendingLocationField) {
        this.setRoutePoint({
          field: this.pendingLocationField,
          point: { ...this.userLocation, label: 'Lokasi saya' },
        })
        this.pendingLocationField = null
      }
    },
    onLocationError(error) {
      if (!this.pendingLocationField) return
      this.pendingLocationField = null
      this.nearestError = error.code === 1
        ? 'Akses lokasi diblokir. Izinkan Lokasi lewat pengaturan situs di bilah alamat Chrome, lalu coba lagi. Anda juga bisa memilih titik di peta.'
        : error.code === 3
        ? 'Pencarian lokasi terlalu lama. Coba lagi atau pilih titik di peta.'
        : 'Lokasi belum tersedia. Periksa layanan lokasi perangkat atau pilih titik di peta.'
    },
    emptyJourney() {
      return {
        transit: { status: 'idle', options: [], nearestHalte: null },
        car: { status: 'idle', route: null, insights: null, message: '' },
        walk: { status: 'idle', route: null },
      }
    },
    openRoute(destination = null) {
      this.closeSearchResults()
      this.selectedMarker = null
      this.complaintLocation = null
      this.searchLocation = null
      this.mobileLayerOpen = false
      this.sidebarCollapsed = false
      this.routePickField = null
      this.nearestError = ''
      this.journeySelected = null
      this.routeMode = true
      this.routeTo = destination
      if (this.userLocation) {
        this.routeFrom = { ...this.userLocation, label: 'Lokasi saya' }
      } else {
        // Ask for the device location once; the field fills in when it arrives.
        this.routeFrom = null
        this.pendingLocationField = 'from'
        this.$refs.leafletMap?.locateMe()
      }
    },
    closeRoute() {
      this.routeController?.abort()
      this.routeMode = false
      this.routeFrom = null
      this.routeTo = null
      this.journey = this.emptyJourney()
      this.journeySelected = null
      this.routePickField = null
      this.pendingLocationField = null
      this.nearestLoading = ''
      this.nearestError = ''
      this.selectedMarker = null
      this.$refs.leafletMap?.clearRoute()
    },
    setRoutePoint({ field, point }) {
      if (field === 'from') this.routeFrom = point
      else this.routeTo = point
      if (this.routePickField === field) this.routePickField = null
      this.nearestError = ''
    },
    swapRoute() {
      const from = this.routeFrom
      this.routeFrom = this.routeTo
      this.routeTo = from
    },
    useMyLocationFor(field) {
      this.nearestError = ''
      if (this.userLocation) {
        this.setRoutePoint({
          field,
          point: { ...this.userLocation, label: 'Lokasi saya' },
        })
        return
      }
      this.pendingLocationField = field
      this.$refs.leafletMap?.locateMe()
    },
    useMarkerFor(field) {
      const marker = this.selectedMarker
      if (!marker) return
      this.setRoutePoint({
        field,
        point: { lat: marker.lat, lng: marker.lng, label: marker.label },
      })
      this.selectedMarker = null
    },
    handleRouteMapPick(point, label) {
      const field = this.routePickField
      if (!field) return
      this.setRoutePoint({
        field,
        point: { lat: point.lat, lng: point.lng, label },
      })
      this.routePickField = null
    },
    async routeToNearest(kind) {
      const base = this.routeFrom || this.userLocation
      if (!base) return
      const labels = {
        halte: 'halte Bus MJT',
        rumahSakit: 'rumah sakit',
        puskesmas: 'puskesmas',
        restArea: 'rest area',
      }
      this.nearestError = ''
      this.nearestLoading = `Mencari ${labels[kind]} terdekat…`
      try {
        let target = null
        if (kind === 'halte') {
          const halte = await nearestHalte(base)
          if (halte)
            target = { lat: halte.lat, lng: halte.lng, label: halte.name }
        } else {
          const datasets = await this.$refs.leafletMap.getDatasets([kind])
          const map = this.$refs.leafletMap
          ;(datasets[kind]?.features || []).forEach((feature) => {
            if (feature.geometry?.type !== 'Point') return
            const [lng, lat] = feature.geometry.coordinates
            const distance = haversine([base.lat, base.lng], [lat, lng])
            if (!target || distance < target.distance)
              target = {
                lat,
                lng,
                distance,
                label: map.featureName(feature, kind),
              }
          })
        }
        if (!target) throw new Error('empty')
        this.routeTo = { lat: target.lat, lng: target.lng, label: target.label }
      } catch (error) {
        this.nearestError = `Data ${labels[kind]} belum dapat dimuat. Coba lagi.`
      } finally {
        this.nearestLoading = ''
      }
    },
    routePadding() {
      if (window.matchMedia('(max-width: 767px)').matches) {
        const top =
          this.$el.querySelector('.ja-route-top')?.offsetHeight || 160
        const bottom =
          this.$el.querySelector('.ja-route-body')?.offsetHeight || 240
        return { top: top + 24, bottom: bottom + 24, left: 32, right: 32 }
      }
      return { top: 80, bottom: 48, left: 56, right: 56 }
    },
    async planJourney() {
      if (!this.routeMode) return
      this.routeController?.abort()
      this.journey = this.emptyJourney()
      this.journeySelected = null
      const map = this.$refs.leafletMap
      const from = this.routeFrom
      const to = this.routeTo
      if (!from || !to) {
        map?.drawJourney({ pins: this.endpointPins() })
        const single = from || to
        if (single) map?.focusLocation(single)
        return
      }
      if (haversine([from.lat, from.lng], [to.lat, to.lng]) < 20) {
        this.nearestError = 'Titik awal dan tujuan terlalu dekat.'
        map?.drawJourney({ pins: this.endpointPins() })
        return
      }
      this.routeController = new AbortController()
      const { signal } = this.routeController
      const straight = haversine([from.lat, from.lng], [to.lat, to.lng])
      this.journey.transit.status = 'loading'
      this.journey.car.status = 'loading'
      map?.drawJourney({ pins: this.endpointPins() })

      const transit = planTransit(from, to, { signal })
        .then((result) => {
          if (signal.aborted) return
          this.journey.transit = {
            status: 'ready',
            options: result.options,
            nearestHalte: result.nearestHalte,
          }
        })
        .catch(() => {
          if (!signal.aborted)
            this.journey.transit = {
              status: 'error',
              options: [],
              nearestHalte: null,
            }
        })
      const car = fetchRoute(from, to, 'car', signal)
        .then((route) => {
          if (signal.aborted) return
          this.journey.car = {
            status: 'ready',
            route,
            insights: null,
            message: '',
          }
          this.updateInsights()
          // Load every dataset the analysis needs; re-analyse as each lands.
          this.$refs.leafletMap
            ?.getDatasets(INSIGHT_LAYERS)
            .then(() => !signal.aborted && this.updateInsights())
        })
        .catch((error) => {
          if (!signal.aborted)
            this.journey.car = {
              status: 'error',
              route: null,
              insights: null,
              message:
                error.code === 'NoRoute'
                  ? 'Tidak ada jalur kendaraan untuk titik ini.'
                  : 'Layanan rute kendaraan sedang tidak tersedia.',
            }
        })
      const walk =
        straight <= 3000
          ? fetchRoute(from, to, 'foot', signal)
              .then((route) => {
                if (!signal.aborted)
                  this.journey.walk = { status: 'ready', route }
              })
              .catch(() => {})
          : Promise.resolve()
      // Preview whichever result arrives first, then settle on the best one.
      transit.then(() => this.drawJourney())
      car.then(() => this.drawJourney())
      await Promise.allSettled([transit, car, walk])
      if (!signal.aborted) this.drawJourney(true)
    },
    updateInsights() {
      const map = this.$refs.leafletMap
      const route = this.journey.car.route
      if (!map || !route) return
      const insights = analyzeRoute(
        route.coordinates,
        map.datasetSnapshot(INSIGHT_LAYERS),
        (feature, id) => map.featureName(feature, id)
      )
      this.journey.car = { ...this.journey.car, insights }
      if (this.journeyPreviewKey === 'car') this.drawJourney()
    },
    selectJourneyOption(option) {
      this.journeySelected = option
    },
    endpointPins() {
      return [
        this.routeFrom && {
          ...this.routeFrom,
          label: 'A',
          variant: 'from',
          title: this.routeFrom.label,
        },
        this.routeTo && {
          ...this.routeTo,
          label: 'B',
          variant: 'to',
          title: this.routeTo.label,
        },
      ].filter(Boolean)
    },
    drawJourney(fit = false) {
      const map = this.$refs.leafletMap
      if (!map || !this.routeMode) return
      const key = this.journeyPreviewKey
      const lines = []
      const pins = this.endpointPins()
      let coords = []
      if (key.startsWith('transit-')) {
        const option = this.journey.transit.options[Number(key.split('-')[1])]
        option?.legs.forEach((leg) => {
          coords = coords.concat(leg.coords)
          if (leg.type === 'walk') {
            lines.push({ coords: leg.coords, color: '#4b5567', weight: 4, dashed: true })
            return
          }
          lines.push({ coords: leg.coords, color: leg.color, weight: 6 })
          pins.push(
            { ...leg.board, color: leg.color, size: 'small', title: leg.board.name },
            { ...leg.alight, color: leg.color, size: 'small', title: leg.alight.name }
          )
        })
      } else if (key === 'car' || key === 'walk') {
        const route = this.journey[key].route
        if (route) {
          coords = route.coordinates
          lines.push({
            coords: route.coordinates,
            color: '#0d6d43',
            weight: 6,
            dashed: key === 'walk',
          })
          if (key === 'car') {
            const insights = this.journey.car.insights
            ;(insights?.roads || []).forEach((road) =>
              lines.push({
                coords: road.coords,
                color: '#ffd05a',
                weight: 2,
                casing: false,
              })
            )
            ;(insights?.hazards || []).forEach((zone) =>
              pins.push({
                lat: zone.lat,
                lng: zone.lng,
                color: zone.level === 'TINGGI' ? '#dc2626' : '#f59e0b',
                size: 'small',
                title: zone.label,
              })
            )
          }
        }
      }
      map.drawJourney({ lines, pins })
      if (fit && coords.length)
        this.$nextTick(() => map.fitRoute(coords, this.routePadding()))
    },
    focusRoutePoint(point) {
      if (Number.isFinite(point?.lat) && Number.isFinite(point?.lng))
        this.$refs.leafletMap?.focusLocation({ lat: point.lat, lng: point.lng })
    },
    reportAt(point) {
      if (!isJalanAingLocation(point.lat, point.lng)) {
        this.showLocationError()
        return
      }
      this.$router.push({
        path: '/jalan-aing/aduan',
        query: {
          mode: this.$route.query.mode,
          lat: point.lat,
          lng: point.lng,
          category: this.$route.query.category,
        },
      })
    },
    async searchRoutePlaces(query, signal) {
      const sources = await Promise.all([
        this.$refs.leafletMap
          .searchActiveLayers(query, signal, {
            layerIds: this.hospitalMode ? ['rumahSakit', 'puskesmas'] : undefined,
          })
          .catch(() => ({ results: [] })),
        searchMapSources(query, {
          sources: mapSearchSources.filter(
            (source) =>
              source.id === 'places' ||
              (source.id === 'busStops' && !this.layerVisibility.busStops)
          ),
          signal,
        }),
      ])
      const seen = new Set()
      return sources
        .flatMap((source) => source.results)
        .sort(
          (left, right) =>
            (left.source === 'dataset' ? 0 : 1) -
            (right.source === 'dataset' ? 0 : 1)
        )
        .filter((place) => {
          const key = `${place.name}:${place.display_name}`
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
    },
    resetLayers() {
      Object.keys(this.layerVisibility).forEach((id) => {
        this.layerVisibility[id] = false
      })
      this.filterStatus.roadClass = 'semua'
    },
    refreshMapSize() {
      this.$refs.leafletMap?.refreshSize()
    },
    toggleLayer({ id, value }) {
      if (id in this.layerVisibility) this.layerVisibility[id] = value
    },
    updateFilter({ key, value }) {
      if (key in this.filterStatus) this.filterStatus[key] = value
    },
    prefetchSearchData() {
      this.$refs.leafletMap?.prefetchSearchData(
        this.hospitalMode ? ['rumahSakit', 'puskesmas'] : undefined
      )
    },
    refreshSearchResults() {
      // A dataset finished loading: re-run the current query in place so new
      // matches appear without clearing what is already listed.
      if (this.searchQuery.length < 3 || this.searchLocation) return
      if (!this.searching && !this.searchResults.length && !this.searchMessage)
        return
      window.clearTimeout(this.refreshSearchTimer)
      this.refreshSearchTimer = window.setTimeout(() => this.searchPlaces(), 150)
    },
    updateDataAvailability(payload) {
      this.dataAvailability = { ...this.dataAvailability, ...payload }
      Object.entries(payload).forEach(([id, available]) => {
        // A failed layer is switched back off so turning it on retries the load.
        if (!available && this.layerVisibility[id])
          this.layerVisibility[id] = false
      })
      if (Object.values(payload).some(Boolean)) {
        this.refreshSearchResults()
        if (
          this.routeMode &&
          this.journey.car.route &&
          Object.keys(payload).some((id) => INSIGHT_LAYERS.includes(id))
        )
          this.updateInsights()
      }
      if (
        (this.searching || this.searchResults.length || this.searchMessage) &&
        ((payload.bus && this.layerVisibility.bus) ||
          (payload.busStops && this.layerVisibility.busStops))
      )
        this.queueSearch()
    },
    updateLayerLoading(payload) {
      this.layerLoading = { ...this.layerLoading, ...payload }
    },
    updateLegendColors(payload) {
      this.legendColors = { ...this.legendColors, ...payload }
    },
    showLocationError(message = 'Titik aduan harus berada di Jawa Barat.') {
      window.clearTimeout(this.locationErrorTimer)
      this.locationError = message
      this.locationErrorTimer = window.setTimeout(() => {
        this.locationError = ''
      }, 2000)
    },
    closeSearchResults() {
      window.clearTimeout(this.searchTimer)
      this.searchRequestId += 1
      this.searchController?.abort()
      this.searching = false
      this.searchResults = []
      this.searchMessage = ''
      this.activeSearchIndex = -1
    },
    selectMarker(marker) {
      if (this.routeMode && this.routePickField && Number.isFinite(marker.lat)) {
        this.handleRouteMapPick(marker, marker.label || marker.type)
        return
      }
      this.closeSearchResults()
      this.selectedMarker = marker
      this.complaintLocation = null
      this.searchLocation = null
      this.locationError = ''
    },
    selectComplaintLocation(location) {
      if (this.routeMode) {
        this.handleRouteMapPick(location, 'Titik di peta')
        return
      }
      if (this.searchResults.length || this.searchMessage) {
        // First tap on the map just dismisses the open search list.
        this.closeSearchResults()
        return
      }
      if (this.hospitalMode) return
      if (!isJalanAingLocation(location.lat, location.lng)) {
        this.complaintLocation = null
        this.showLocationError()
        return
      }
      this.complaintLocation = location
      this.selectedMarker = null
      this.searchLocation = null
      this.locationError = ''
    },
    openComplaintForm() {
      this.$router.push({
        path: '/jalan-aing/aduan',
        query: {
          mode: this.$route.query.mode,
          ...this.complaintLocation,
          category: this.$route.query.category,
        },
      })
    },
    queueSearch(query = this.searchQuery) {
      this.searchQuery = query.trim()
      window.clearTimeout(this.searchTimer)
      this.searchRequestId += 1
      this.searchController?.abort()
      this.searching = false
      this.searchMessage = ''
      this.searchResults = []
      this.activeSearchIndex = -1
      if (this.searchQuery.length && this.searchQuery.length < 3)
        this.searchMessage = 'Ketik minimal 3 huruf untuk mencari.'
      if (this.searchQuery.length < 3) return
      this.searchTimer = window.setTimeout(() => this.searchPlaces(), 450)
    },
    clearSearch() {
      window.clearTimeout(this.searchTimer)
      this.searchRequestId += 1
      this.searchController?.abort()
      this.searchQuery = ''
      this.searchResults = []
      this.searchMessage = ''
      this.searching = false
      this.searchLocation = null
      this.activeSearchIndex = -1
    },
    async searchPlaces() {
      if (this.searchQuery.length < 3) return
      const requestId = ++this.searchRequestId
      this.searchController?.abort()
      this.searchController = new AbortController()
      this.searching = true
      try {
        const signal = this.searchController.signal
        const hospitalLayers = ['rumahSakit', 'puskesmas']
        const sources = await Promise.all([
          this.$refs.leafletMap
            .searchActiveLayers(this.searchQuery, signal, {
              layerIds: this.hospitalMode ? hospitalLayers : undefined,
            })
            .catch(() => ({ results: [], available: false })),
          ...(this.hospitalMode
            ? []
            : [
                searchMapSources(this.searchQuery, {
                  sources: mapSearchSources.filter(
                    (source) =>
                      source.id === 'places' ||
                      (source.id === 'busStops' &&
                        !this.layerVisibility.busStops)
                  ),
                  signal,
                }),
              ]),
        ])
        const sourceRank = (place) =>
          place.source === 'dataset' ? (place.active ? 0 : 1) : 2
        const results = sources
          .flatMap((source) => source.results)
          .map((place) => ({
            ...place,
            source: place.source || 'osm',
          }))
          .sort((left, right) => sourceRank(left) - sourceRank(right))
          .filter((place, index, list) => {
            const key = `${place.source}:${place.name}:${place.display_name}`
            return (
              list.findIndex(
                (other) =>
                  `${other.source}:${other.name}:${other.display_name}` ===
                  key
              ) === index
            )
          })
        const available = sources.some((source) => source.available)
        if (requestId !== this.searchRequestId) return
        this.searchMessage = ''
        this.searchResults = results
        this.activeSearchIndex = results.length ? 0 : -1
        if (!results.length && this.datasetsLoading) {
          this.searchMessage = ''
        } else if (!results.length) {
          this.searchMessage = available
            ? this.hospitalMode
              ? 'Fasilitas kesehatan tidak ditemukan.'
              : 'Tidak ada hasil di data Jalan Aing maupun OpenStreetMap.'
            : 'Pencarian lokasi belum tersedia.'
        }
      } catch (error) {
        if (requestId === this.searchRequestId)
          this.searchMessage = 'Pencarian lokasi belum tersedia.'
      } finally {
        if (requestId === this.searchRequestId) this.searching = false
      }
    },
    focusPlace(place) {
      window.clearTimeout(this.searchTimer)
      this.searchRequestId += 1
      this.searchController?.abort()
      this.searching = false
      const lat = Number(place.lat)
      const lng = Number(place.lon)
      if (!isJalanAingLocation(lat, lng)) {
        this.showLocationError('Lokasi ini di luar Jawa Barat.')
        return
      }
      if (
        place.layerId &&
        place.layerId in this.layerVisibility &&
        !this.layerVisibility[place.layerId]
      ) {
        this.skipLayerSearch = true
        this.layerVisibility[place.layerId] = true
      }
      this.complaintLocation = null
      this.selectedMarker = place.marker || null
      this.searchLocation = { lat, lng, label: place.name }
      this.$nextTick(() => {
        if (!this.searchLocation) this.searchLocation = { lat, lng, label: place.name }
        this.$refs.leafletMap?.focusLocation(this.searchLocation)
      })
      this.searchResults = []
      this.searchMessage = ''
      this.activeSearchIndex = -1
      this.locationError = ''
    },
    handleSearchKeydown(event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (!this.searchResults.length) return
        event.preventDefault()
        const change = event.key === 'ArrowDown' ? 1 : -1
        this.activeSearchIndex =
          (this.activeSearchIndex + change + this.searchResults.length) %
          this.searchResults.length
      } else if (event.key === 'Enter' && this.activeSearchIndex >= 0) {
        event.preventDefault()
        this.focusPlace(this.searchResults[this.activeSearchIndex])
      } else if (event.key === 'Escape') {
        this.clearSearch()
      }
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
  position: fixed;
  inset: 0;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
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
  min-height: 0;
  overflow: hidden;
}
.ja-map-canvas {
  position: relative;
  width: 100%;
  height: 100%;
}
.ja-map-mobile-layers {
  position: absolute;
  bottom: 36px;
  left: clamp(20px, 3vw, 40px);
  z-index: 600;
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 14px;
  border: 0;
  border-radius: 14px;
  background: var(--ja-map-paper);
  color: var(--ja-map-ink);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 10px 24px rgba(20, 35, 63, 0.16);
}
::v-deep(.ja-map-leaflet) {
  min-height: 0 !important;
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
.ja-map-search input::placeholder {
  color: #8791a3;
}
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
.ja-map-search-clear:hover {
  background: #e1e5ea;
}
.ja-map-search-clear:focus-visible {
  outline: 2px solid var(--ja-map-yellow);
  outline-offset: 2px;
}
.ja-map-search-progress {
  position: absolute;
  right: 13px;
  bottom: 5px;
  left: 45px;
  height: 2px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--ja-map-rule);
  pointer-events: none;
}
.ja-map-search-progress::after {
  position: absolute;
  inset: 0 auto 0 0;
  width: 36%;
  border-radius: inherit;
  background: var(--ja-map-green-dark);
  content: '';
  animation: ja-map-search-progress 0.9s linear infinite;
}
.ja-map-search-loading-text {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}
.ja-map-search:focus-within {
  border-color: #7b8595;
  box-shadow: 0 0 0 3px rgba(70, 80, 100, 0.14),
    0 6px 20px rgba(20, 35, 63, 0.12);
}
.ja-map-search input:focus-visible {
  outline: 0;
}
.ja-map-search-results {
  position: absolute;
  top: 74px;
  left: 50%;
  z-index: 750;
  width: min(400px, calc(100% - 440px));
  min-width: 260px;
  max-height: min(480px, calc(100dvh - 96px));
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
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
.ja-map-search-results button:focus-visible,
.ja-map-search-results button.is-active {
  background: #f5f7f9;
}
.ja-map-search-results button:focus-visible {
  outline: 2px solid var(--ja-map-yellow);
  outline-offset: -2px;
}
.ja-map-search-results .ja-map-search-result-text {
  flex: 1;
  min-width: 0;
  margin: 0;
  color: var(--ja-map-ink);
}
.ja-map-search-results strong {
  color: var(--ja-map-ink);
}
.ja-map-search-results em.ja-map-search-result-tag {
  flex: 0 0 auto;
  align-self: center;
  padding: 3px 8px;
  border: 1px solid var(--ja-map-rule);
  border-radius: 6px;
  color: var(--ja-map-green-dark);
  font-size: 11px;
  font-style: normal;
  font-weight: 700;
}
.ja-map-search-results strong,
.ja-map-search-results span {
  display: block;
}
.ja-map-search-results strong {
  font-size: 12px;
}
.ja-map-search-results span,
.ja-map-search-results p {
  margin: 3px 0 0;
  color: #68758a;
  font-size: 11px;
  line-height: 1.35;
}
.ja-map-search-results p:not(.ja-map-search-results-label) {
  padding: 12px 13px;
}
.ja-map-search-results p.ja-map-search-pending {
  margin: 0;
  border-top: 1px solid var(--ja-map-rule);
  background: #f7faf8;
  color: var(--ja-map-green-dark);
  font-weight: 700;
}
.ja-map-location-error {
  position: absolute;
  z-index: 750;
  right: clamp(20px, 3vw, 48px);
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 9px;
  width: min(360px, calc(100% - 40px));
  margin: 0;
  padding: 12px 14px;
  border: 1px solid #d6e2da;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(37, 55, 45, 0.12);
  color: #466052;
  font-size: 13px;
  font-weight: 600;
}
.ja-map-location-error :deep(svg) {
  color: #2f7a50;
  flex: 0 0 auto;
}
.ja-map-notice-enter-active {
  animation: ja-map-notice-bounce 420ms cubic-bezier(0.22, 1.4, 0.36, 1);
}
.ja-map-notice-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}
.ja-map-notice-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
@keyframes ja-map-notice-bounce {
  0% {
    opacity: 0;
    transform: translateY(14px) scale(0.9);
  }
  65% {
    opacity: 1;
    transform: translateY(-3px) scale(1.02);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}
@keyframes ja-map-search-progress {
  from {
    transform: translateX(-300%);
  }
  to {
    transform: translateX(400%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .ja-map-search-progress::after {
    animation-duration: 1.8s;
  }
  .ja-map-notice-enter-active {
    animation: none;
  }
}
.ja-map-detail-card {
  position: absolute;
  z-index: 700;
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
.ja-map-fold,
.ja-map-chips,
.ja-map-basemaps {
  display: none;
}
@media (min-width: 768px) {
  .ja-map-shell {
    display: flex;
  }
  .ja-map-sidebar {
    position: relative;
    z-index: 700;
    display: flex;
    width: 390px;
    flex: 0 0 390px;
    flex-direction: column;
    min-height: 0;
    border-right: 1px solid var(--ja-map-rule);
    background: #fff;
    box-shadow: 0 4px 8px rgba(20, 35, 63, 0.12);
    transition: margin-left 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .is-sidebar-collapsed .ja-map-sidebar {
    margin-left: -390px;
    box-shadow: none;
    visibility: hidden;
    transition: margin-left 260ms cubic-bezier(0.2, 0.8, 0.2, 1),
      visibility 0s linear 260ms;
  }
  .ja-map-sidebar-top {
    position: relative;
    padding: 15px 25px 0;
  }
  .ja-map-search {
    position: relative;
    top: auto;
    left: auto;
    width: 100%;
    min-width: 0;
    height: 46px;
    min-height: 46px;
    padding: 0 12px 0 14px;
    border: 2px solid var(--ja-map-green-dark);
    border-radius: 8px;
    box-shadow: none;
    transform: none;
  }
  .ja-map-search:focus-within {
    border-color: var(--ja-map-green-dark);
    box-shadow: 0 0 0 4px rgba(13, 109, 67, 0.12);
  }
  .ja-map-search-icon {
    color: var(--ja-map-green-dark);
  }
  .ja-map-search input {
    font-size: 15px;
  }
  .ja-map-search-results {
    top: 67px;
    right: 25px;
    left: 25px;
    width: auto;
    min-width: 0;
    max-height: min(480px, calc(100dvh - 180px));
    border-radius: 10px;
    transform: none;
  }
  .ja-map-layer-card {
    width: 100% !important;
    flex: 1 1 auto;
    min-height: 0;
  }
  .ja-map-canvas {
    flex: 1 1 auto;
    min-width: 0;
  }
  .ja-map-mobile-layers {
    display: none;
  }
  .ja-map-fold {
    position: absolute;
    top: 50%;
    left: 0;
    z-index: 650;
    display: grid;
    width: 23px;
    height: 46px;
    place-items: center;
    padding: 0;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-left: 0;
    border-radius: 0 9px 9px 0;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    color: #4b5567;
    cursor: pointer;
    transform: translateY(-50%);
  }
  .ja-map-fold:hover {
    color: var(--ja-map-green-dark);
  }
  .ja-map-chips {
    position: absolute;
    top: 15px;
    right: 237px;
    left: 15px;
    z-index: 600;
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding: 2px;
    scrollbar-width: none;
  }
  .ja-map-chips::-webkit-scrollbar {
    display: none;
  }
  .ja-map-chip {
    display: inline-flex;
    height: 38px;
    flex: 0 0 auto;
    align-items: center;
    gap: 8px;
    padding: 0 16px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 999px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    color: var(--ja-map-ink);
    font-family: Lato, sans-serif;
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 160ms ease, color 160ms ease,
      border-color 160ms ease;
  }
  .ja-map-chip:hover {
    border-color: var(--ja-map-green-dark);
  }
  .ja-map-chip.is-on {
    border-color: var(--ja-map-green-dark);
    background: var(--ja-map-green-dark);
    color: #fff;
  }
  .ja-map-chip.is-unavailable:not(.is-on) {
    border-style: dashed;
    color: #8a94a3;
  }
  .ja-map-chip.is-loading {
    cursor: wait;
    opacity: 1;
  }
  .ja-map-chip.is-loading {
    animation: ja-map-chip-pulse 0.9s ease-in-out infinite alternate;
  }
  .ja-map-basemaps {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 600;
    display: flex;
    gap: 6px;
  }
  .ja-map-basemap {
    display: flex;
    width: 64px;
    height: 58px;
    flex-direction: column;
    overflow: hidden;
    padding: 0;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    color: #1c1c1c;
    cursor: pointer;
  }
  .ja-map-basemap img {
    display: block;
    width: 100%;
    height: 36px;
    object-fit: cover;
  }
  .ja-map-basemap span {
    display: block;
    padding: 5px 0;
    font-family: Lato, sans-serif;
    font-size: 10px;
    font-weight: 700;
    line-height: 12px;
    text-align: center;
  }
  .ja-map-basemap.is-on {
    border-color: var(--ja-map-green-dark);
    box-shadow: 0 0 0 1px var(--ja-map-green-dark),
      0 1px 3px rgba(0, 0, 0, 0.1);
    color: var(--ja-map-green-dark);
  }
  .ja-map-fold:focus-visible,
  .ja-map-chip:focus-visible,
  .ja-map-basemap:focus-visible {
    outline: 3px solid var(--ja-map-yellow);
    outline-offset: 2px;
  }
  .ja-map-detail-card,
  .ja-map-location-error {
    right: auto;
    bottom: 15px;
    left: 38px;
  }
  ::v-deep(.ja-map-leaflet .right-4.top-5) {
    top: auto;
    right: 15px;
    bottom: 32px;
    gap: 8px;
  }
  ::v-deep(.ja-map-leaflet .h-10.w-10) {
    width: 37px;
    height: 37px;
    border-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}
@keyframes ja-map-chip-pulse {
  to {
    opacity: 0.55;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ja-map-sidebar {
    transition: none !important;
  }
}
@media (min-width: 768px) and (max-width: 1280px),
  (min-width: 768px) and (max-height: 800px) {
  .ja-map-detail-card {
    width: min(310px, calc(100% - 53px));
    padding: 16px;
    border-radius: 16px;
  }
  .ja-map-detail-card h2 {
    max-width: 250px;
    font-size: 17px;
  }
  .ja-map-report-button {
    min-height: 40px;
    margin-top: 14px;
    border-radius: 9px;
    font-size: 12px;
  }
}
@media (min-width: 768px) and (max-width: 1100px) {
  .ja-map-sidebar {
    width: 340px;
    flex-basis: 340px;
  }
  .is-sidebar-collapsed .ja-map-sidebar {
    margin-left: -340px;
  }
  .ja-map-basemaps {
    display: none;
  }
  .ja-map-chips {
    right: 15px;
  }
}
@media (max-width: 767px) {
  .ja-map-sidebar,
  .ja-map-sidebar-top {
    display: contents;
  }
  .ja-map-chips {
    position: absolute;
    top: 64px;
    right: 0;
    left: 0;
    z-index: 600;
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding: 0 12px 4px;
    scrollbar-width: none;
  }
  .ja-map-chips::-webkit-scrollbar {
    display: none;
  }
  .ja-map-chip {
    display: inline-flex;
    height: 36px;
    flex: 0 0 auto;
    align-items: center;
    gap: 7px;
    padding: 0 14px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 999px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    color: var(--ja-map-ink);
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
  }
  .ja-map-chip.is-on {
    border-color: var(--ja-map-green-dark);
    background: var(--ja-map-green-dark);
    color: #fff;
  }
  .ja-map-chip.is-unavailable:not(.is-on) {
    border-style: dashed;
    color: #8a94a3;
  }
}
@media (max-width: 820px) {
  .ja-map-nav {
    display: none;
  }
}
@media (max-width: 640px) {
  .ja-map-page {
    height: 100vh;
    height: 100dvh;
    min-height: 0;
  }
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
    height: calc(100vh - 128px);
    height: calc(100dvh - 128px);
    min-height: 0;
  }
  ::v-deep(.ja-map-leaflet) {
    min-height: 0 !important;
  }
  .ja-map-search {
    top: 12px;
    left: 12px;
    width: calc(100% - 24px);
    min-width: 0;
    height: 44px;
    min-height: 44px;
    gap: 6px;
    padding: 0 10px;
    transform: none;
  }
  .ja-map-search.has-query {
    padding-right: 0;
  }
  .ja-map-search:focus-within {
    border-color: var(--ja-map-green-dark);
    box-shadow: 0 0 0 1px var(--ja-map-green-dark);
  }
  .ja-map-search-icon {
    width: 18px;
    height: 18px;
  }
  .ja-map-search input {
    font-size: 16px;
  }
  .ja-map-search input::-webkit-search-cancel-button {
    display: none;
  }
  .ja-map-search-clear {
    position: relative;
    isolation: isolate;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: transparent;
  }
  .ja-map-search-clear::before {
    position: absolute;
    inset: 8px;
    z-index: -1;
    border-radius: 50%;
    content: '';
  }
  .ja-map-search-clear:hover,
  .ja-map-search-clear:active {
    background: transparent;
  }
  .ja-map-search-clear:hover::before,
  .ja-map-search-clear:active::before {
    background: var(--ja-map-rule);
  }
  .ja-map-search-clear:focus-visible {
    outline-color: var(--ja-map-green-dark);
    outline-offset: -3px;
  }
  .ja-map-search-progress {
    left: 34px;
    right: 10px;
    bottom: 3px;
  }
  .ja-map-search-results {
    top: 64px;
    left: 12px;
    width: calc(100% - 24px);
    min-width: 0;
    max-height: min(360px, calc(100% - 136px));
    transform: none;
  }
  .ja-map-search-results button {
    min-height: 44px;
    padding: 12px;
  }
  .ja-map-search-results button > span {
    flex: 1;
    min-width: 0;
  }
  .ja-map-search-results strong {
    overflow: hidden;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ja-map-search-results span {
    font-size: 12px;
    overflow-wrap: anywhere;
  }
  .ja-map-detail-card {
    right: 12px;
    bottom: calc(124px + env(safe-area-inset-bottom));
    width: calc(100% - 24px);
    max-height: calc(100% - 196px - env(safe-area-inset-bottom));
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 16px;
    border-radius: 16px;
  }
  .ja-map-detail-card h2 {
    margin-right: 44px;
    font-size: 18px;
    overflow-wrap: anywhere;
  }
  .ja-map-detail-close {
    top: 8px;
    right: 8px;
    width: 44px;
    height: 44px;
  }
  .ja-map-detail-card dd {
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .ja-map-detail-close:focus-visible,
  .ja-map-report-button:focus-visible,
  .ja-map-search-results button:focus-visible {
    outline-color: var(--ja-map-green-dark);
  }
  .ja-map-location-error {
    right: 12px;
    bottom: calc(124px + env(safe-area-inset-bottom));
    width: calc(100% - 24px);
    box-sizing: border-box;
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
    right: 12px;
    bottom: calc(68px + env(safe-area-inset-bottom));
    left: auto;
    display: grid;
    width: 44px;
    min-height: 44px;
    padding: 0;
    border-radius: 12px;
  }
  .ja-map-mobile-layers > span {
    display: none;
  }
  .ja-map-mobile-layers:active {
    background: var(--ja-map-rule);
  }
  .ja-map-mobile-layers:focus-visible {
    outline-color: var(--ja-map-green-dark);
  }
  ::v-deep(.ja-map-leaflet .right-4.top-5) {
    top: 64px;
    right: 12px;
    gap: 8px;
  }
  ::v-deep(.ja-map-leaflet .h-10.w-10) {
    width: 44px;
    height: 44px;
    border-radius: 12px;
  }
  ::v-deep(.ja-map-leaflet .ja-map-reset-button) {
    order: -1;
  }
  ::v-deep(.ja-map-leaflet .h-10.w-10:focus-visible) {
    outline: 2px solid var(--ja-map-green-dark);
    outline-offset: 3px;
  }
}
/* Shared motion: one ease for everything that slides, like native sheets. */
.ja-map-page {
  --ja-ease-out: cubic-bezier(0.32, 0.72, 0, 1);
}
.ja-map-page button {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.ja-map-chip,
.ja-map-basemap,
.ja-map-mobile-layers,
.ja-map-report-button,
.ja-map-route-open,
.ja-map-route-here,
.ja-map-fold {
  transition: transform 160ms var(--ja-ease-out),
    background-color 160ms ease, color 160ms ease, border-color 160ms ease;
}
.ja-map-chip:active,
.ja-map-basemap:active,
.ja-map-mobile-layers:active,
.ja-map-report-button:active,
.ja-map-route-open:active,
.ja-map-route-here:active {
  transform: scale(0.96);
}
.ja-map-route-open {
  display: inline-flex;
  height: 32px;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  margin-right: -4px;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  background: #e6f6ec;
  color: var(--ja-map-green-dark);
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}
.ja-map-route-open:hover {
  background: #d4eedd;
}
.ja-map-route-open:focus-visible,
.ja-map-route-here:focus-visible {
  outline: 2px solid var(--ja-map-green-dark);
  outline-offset: 2px;
}
.ja-map-route-here {
  display: flex;
  width: 100%;
  min-height: 44px;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding: 0 14px;
  border: 1px solid var(--ja-map-green-dark);
  border-radius: 8px;
  background: #fff;
  color: var(--ja-map-green-dark);
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}
.ja-map-route-here:hover {
  background: #f1f8f4;
}
.ja-map-route-set {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 14px;
}
.ja-map-route-set button {
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid var(--ja-map-green-dark);
  border-radius: 8px;
  background: #fff;
  color: var(--ja-map-green-dark);
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}
.ja-map-route-set button.is-primary {
  background: var(--ja-map-green-dark);
  color: #fff;
}
.is-route-mode .ja-map-detail-card {
  z-index: 780;
}
.ja-sheet-enter-active {
  transition: opacity 240ms var(--ja-ease-out),
    transform 380ms var(--ja-ease-out);
}
.ja-sheet-leave-active {
  transition: opacity 160ms ease, transform 200ms ease-in;
}
.ja-sheet-enter,
.ja-sheet-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
@media (max-width: 767px) {
  .ja-sheet-enter,
  .ja-sheet-leave-to {
    opacity: 1;
    transform: translateY(100%);
  }
  .is-route-mode .ja-map-chips,
  .is-route-mode .ja-map-mobile-layers {
    display: none;
  }
  .is-route-mode ::v-deep(.ja-map-leaflet .right-4.top-5) {
    bottom: calc(148px + env(safe-area-inset-bottom)) !important;
  }
  .ja-map-route-open {
    height: 36px;
  }
  .ja-map-route-open span {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ja-sheet-enter-active,
  .ja-sheet-leave-active {
    transition: opacity 120ms linear;
  }
  .ja-sheet-enter,
  .ja-sheet-leave-to {
    transform: none !important;
  }
  .ja-map-chip:active,
  .ja-map-basemap:active,
  .ja-map-mobile-layers:active,
  .ja-map-report-button:active,
  .ja-map-route-open:active,
  .ja-map-route-here:active {
    transform: none;
  }
}

/* Mobile: flatter corners, thumb-reach controls, one bottom-sheet pattern. */
@media (max-width: 767px) {
  .ja-map-search {
    top: 12px;
    left: 12px;
    width: calc(100% - 24px);
    height: 48px;
    min-height: 48px;
    border: 1px solid #d5dbe2;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(20, 35, 63, 0.12);
    transform: none;
  }
  .ja-map-search:focus-within {
    border-color: var(--ja-map-green-dark);
    box-shadow: 0 0 0 1px var(--ja-map-green-dark),
      0 2px 8px rgba(20, 35, 63, 0.12);
  }
  .ja-map-search-results {
    top: 66px;
    left: 12px;
    width: calc(100% - 24px);
    max-height: calc(100% - 84px);
    border-radius: 8px;
    transform: none;
  }
  .ja-map-search-clear,
  .ja-map-search-clear::before {
    border-radius: 6px;
  }
  .ja-map-chips {
    top: 68px;
    padding: 0 12px 4px;
    -webkit-mask-image: linear-gradient(
      90deg,
      #000 calc(100% - 28px),
      transparent
    );
    mask-image: linear-gradient(90deg, #000 calc(100% - 28px), transparent);
  }
  .ja-map-chip {
    height: 36px;
    padding: 0 12px;
    border-radius: 6px;
    font-size: 13px;
  }
  .ja-map-mobile-layers {
    right: 12px;
    bottom: calc(12px + env(safe-area-inset-bottom));
    left: auto;
    display: inline-flex;
    width: auto;
    min-height: 44px;
    gap: 8px;
    padding: 0 14px;
    border: 1px solid #d5dbe2;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(20, 35, 63, 0.14);
  }
  .ja-map-mobile-layers > span {
    display: inline;
  }
  .ja-map-mobile-layers .ja-map-mobile-layers-count {
    display: inline-grid;
    min-width: 20px;
    height: 20px;
    place-items: center;
    padding: 0 5px;
    border-radius: 4px;
    background: var(--ja-map-green-dark);
    color: #fff;
    font-size: 11px;
  }
  ::v-deep(.ja-map-leaflet .right-4.top-5) {
    top: auto !important;
    right: 12px !important;
    bottom: calc(64px + env(safe-area-inset-bottom)) !important;
    gap: 8px;
  }
  ::v-deep(.ja-map-leaflet .ja-map-reset-button) {
    display: none;
  }
  ::v-deep(.ja-map-leaflet .h-10.w-10) {
    width: 44px;
    height: 44px;
    border-color: #d5dbe2;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(20, 35, 63, 0.14);
  }
  ::v-deep(.jalan-aing-map-coordinates) {
    display: none !important;
  }
  .ja-map-detail-card,
  .ja-map-complaint-card,
  .ja-map-marker-card {
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    max-height: calc(100% - 120px);
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 18px 16px calc(16px + env(safe-area-inset-bottom));
    border: 0;
    border-top: 1px solid var(--ja-map-rule);
    border-radius: 12px 12px 0 0;
    box-shadow: 0 -6px 24px rgba(20, 35, 63, 0.14);
  }
  .ja-map-detail-card::before {
    position: absolute;
    top: 6px;
    left: 50%;
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: #d5dbe2;
    content: '';
    transform: translateX(-50%);
  }
  .ja-map-detail-close {
    border-radius: 8px;
  }
  .ja-map-detail-card dl {
    border-radius: 8px;
  }
  .ja-map-report-button,
  .ja-map-complaint-card .ja-map-report-button {
    min-height: 48px;
    border-radius: 8px;
    font-size: 14px;
  }
  .ja-map-complaint-card .ja-map-coordinate {
    border-radius: 6px;
  }
  .ja-map-location-error {
    top: 116px;
    right: 12px;
    bottom: auto;
    left: 12px;
    width: auto;
    border-radius: 8px;
  }
}
.ja-map-page.is-hospital-mode .ja-map-shell {
  height: 100vh;
  height: 100dvh;
}
@media (max-width: 767px) {
  .ja-map-marker-card {
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    max-height: calc(100% - 72px);
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 16px 16px calc(16px + env(safe-area-inset-bottom));
    border-radius: 16px 16px 0 0;
  }
  .ja-map-page.is-hospital-mode .ja-map-layer-card {
    bottom: env(safe-area-inset-bottom);
  }
}
</style>
