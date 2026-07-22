<template>
  <div class="jalan-aing-leaflet relative h-full min-h-[560px] w-full overflow-hidden bg-slate-200 font-lato">
    <div ref="map" class="absolute inset-0 z-0" />

    <div class="absolute right-4 top-20 z-[500] flex flex-col gap-2 md:bottom-5 md:right-5 md:top-auto">
      <button type="button" class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50" aria-label="Perbesar peta" @click="zoomIn"><Icon name="plus" size="18px" /></button>
      <button type="button" class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50" aria-label="Perkecil peta" @click="zoomOut"><Icon name="minus" size="18px" /></button>
      <button type="button" class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50" aria-label="Lokasi saya" @click="locateMe"><Icon src="/icon/location-picker.svg" size="18px" /></button>
      <button type="button" class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50" aria-label="Reset peta" @click="resetView"><Icon name="refresh" size="18px" /></button>
    </div>

    <div v-if="mapConfig" class="absolute bottom-4 left-4 z-[500] rounded-xl border border-slate-200 bg-white px-4 py-2 font-mono text-xs font-bold text-slate-500 shadow-lg md:hidden">
      Lng: {{ mapConfig.center[1].toFixed(4) }}° E&nbsp; | &nbsp;Lat: {{ mapConfig.center[0].toFixed(4) }}° S
    </div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import { csvRecords } from '~/utils/jalan-aing-csv'

const ROAD_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1JSiHBGrGJztFuPgyYtkYJ3s8yTZPfEYnqKYrocUpN0w/gviz/tq?tqx=out:csv&gid=1884441526'

const LEAFLET_MAP_CONFIG = Object.freeze({
  center: [-6.9175, 107.6191],
  zoom: 9,
  minZoom: 7,
  maxZoom: 19,
  basemaps: {
    osm: {
      label: 'Light',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
    satellite: {
      label: 'Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri',
    },
    dark: {
      label: 'Dark',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    },
  },
})

const MAP_COLORS = Object.freeze({
  primary: '#008444',
  primarySoft: '#C3E9D0',
})

export default {
  name: 'JalanAingLeafletMap',
  props: {
    layerVisibility: {
      type: Object,
      required: true,
    },
    filterStatus: { type: Object, required: true },
  },
  data() {
    return {
      map: null,
      leaflet: null,
      baseLayer: null,
      mapConfig: null,
      layerGroups: {},
      markerLayers: [],
      pendingLocate: false,
      roads: [],
    }
  },
  watch: {
    layerVisibility: {
      deep: true,
      handler(value) {
        this.syncLayers(value)
      },
    },
    filterStatus: {
      deep: true,
      handler() { this.renderRoads() },
    },
  },
  async mounted() {
    this.mapConfig = this.readMapConfig()
    const module = await import('leaflet')
    this.leaflet = module.default || module
      this.initMap()
  },
  beforeDestroy() {
    if (this.map) {
      this.map.remove()
      this.map = null
    }
  },
  methods: {
    readMapConfig() {
      const params = new URLSearchParams(window.location.search)
      const basemap = Object.prototype.hasOwnProperty.call(LEAFLET_MAP_CONFIG.basemaps, params.get('basemap'))
        ? params.get('basemap')
        : 'osm'

      return {
        center: LEAFLET_MAP_CONFIG.center,
        zoom: LEAFLET_MAP_CONFIG.zoom,
        basemap,
      }
    },
    initMap() {
      const L = this.leaflet
      const config = this.mapConfig || {
        center: LEAFLET_MAP_CONFIG.center,
        zoom: LEAFLET_MAP_CONFIG.zoom,
        basemap: 'osm',
      }
      this.map = L.map(this.$refs.map, {
        center: config.center,
        zoom: config.zoom,
        minZoom: LEAFLET_MAP_CONFIG.minZoom,
        maxZoom: LEAFLET_MAP_CONFIG.maxZoom,
        zoomControl: false,
        preferCanvas: true,
      })
      this.setBasemap(config.basemap)
      this.createDataLayers()
      this.map.on('click', (event) => this.$emit('create-complaint', event.latlng))
      if (this.layerVisibility.ruasJalan) this.loadRoads()
      this.syncLayers(this.layerVisibility)
      if (this.pendingLocate) {
        this.pendingLocate = false
        this.locateMe()
      }
      window.setTimeout(() => this.map?.invalidateSize(), 100)
    },
    setBasemap(id) {
      if (!this.map || !this.leaflet || !LEAFLET_MAP_CONFIG.basemaps[id]) return
      const base = LEAFLET_MAP_CONFIG.basemaps[id]
      if (this.baseLayer) this.baseLayer.remove()
      this.baseLayer = this.leaflet.tileLayer(base.url, {
        attribution: base.attribution,
        maxZoom: LEAFLET_MAP_CONFIG.maxZoom,
      }).addTo(this.map)
    },
    createDataLayers() {
      const L = this.leaflet
      this.layerGroups = Object.fromEntries(Object.keys(this.layerVisibility).map((id) => [id, L.layerGroup()]))
      this.markerLayers = []
    },
    async loadRoads() {
      try {
        const response = await fetch(ROAD_SHEET_URL)
        if (!response.ok) throw new Error('Master data ruas jalan tidak tersedia')
        this.roads = csvRecords(await response.text()).map((road, index) => ({
          id: `${road.No || index}-${road['Nomor Ruas Jalan'] || ''}`,
          name: road['Nama Ruas Jalan'], number: road['Nomor Ruas Jalan'], city: road['Nama Kabupaten / Kota'],
          condition: road['Kondisi Jalan'], surface: road['Jenis Permukaan'], length: road['Panjang Ruas Jalan'],
          from: [Number(road['Latitude Awal']), Number(road['Longitude Awal'])], to: [Number(road['Latitude Akhir']), Number(road['Longitude Akhir'])],
        })).filter((road) => road.name && road.from.every(Number.isFinite) && road.to.every(Number.isFinite))
        this.renderRoads()
        this.$emit('data-status', { ruasJalan: this.roads.length > 0 })
      } catch (error) {
        this.$emit('data-status', { ruasJalan: false })
        this.$emit('notify', 'Data ruas jalan belum dapat dimuat')
      }
    },
    roadColor(condition) {
      return ({ baik: '#008444', ringan: '#CA8A04', sedang: '#EA580C', berat: '#D32F2F' })[(condition || '').toLowerCase()] || '#64748B'
    },
    renderRoads() {
      const layer = this.layerGroups.ruasJalan
      if (!layer || !this.leaflet) return
      layer.clearLayers()
      const condition = this.filterStatus.roadCondition
      this.roads.filter((road) => condition === 'semua' || road.condition.toLowerCase().includes(condition.replace('rusak_', ''))).forEach((road) => {
        const line = this.leaflet.polyline([road.from, road.to], { color: this.roadColor(road.condition), weight: 4, opacity: 0.85 })
        line.bindPopup(this.roadPopup(road))
        line.on('click', () => this.$emit('select-marker', { type: 'Ruas Jalan', label: road.name, ...road }))
        layer.addLayer(line)
      })
      this.syncLayers(this.layerVisibility)
    },
    roadPopup(road) {
      const safe = (value) => String(value || '—').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character])
      return `<strong>${safe(road.name)}</strong><br>Ruas: ${safe(road.number)}<br>Kab/Kota: ${safe(road.city)}<br>Kondisi: ${safe(road.condition)}<br>Permukaan: ${safe(road.surface)}<br>Panjang: ${safe(road.length)} m`
    },
    search(query) {
      const term = query.trim().toLowerCase()
      const results = term ? this.roads.filter((road) => `${road.name} ${road.city}`.toLowerCase().includes(term)).slice(0, 6) : []
      this.$emit('search-results', results)
    },
    focusRoad(id) {
      const road = this.roads.find((item) => item.id === id)
      if (!road || !this.map) return
      const bounds = this.leaflet.latLngBounds([road.from, road.to])
      this.map.fitBounds(bounds, { padding: [32, 32], maxZoom: 15 })
    },
    syncLayers(visibility) {
      if (!this.map) return
      Object.entries(this.layerGroups).forEach(([id, layer]) => {
        const isVisible = this.map.hasLayer(layer)
        if (visibility[id] && !isVisible) {
          layer.addTo(this.map)
          this.animateLayer(layer)
        } else if (!visibility[id] && isVisible) {
          layer.remove()
        }
      })
    },
    animateLayer(layer) {
      layer.eachLayer((point) => this.animatePoint(point))
    },
    animatePoint(point) {
      const path = point?._path
      if (!path) return
      path.classList.remove('jalan-aing-point-enter')
      window.requestAnimationFrame(() => path.classList.add('jalan-aing-point-enter'))
    },
    zoomIn() {
      this.map?.zoomIn()
    },
    zoomOut() {
      this.map?.zoomOut()
    },
    resetView() {
      const config = this.mapConfig || LEAFLET_MAP_CONFIG
      this.map?.setView(config.center, config.zoom)
    },
    locateMe() {
      if (!this.map) {
        this.pendingLocate = true
        return
      }
      this.map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true })
        .once('locationfound', (event) => {
          const locationCircle = this.leaflet.circle(event.latlng, { radius: event.accuracy, color: MAP_COLORS.primary, fillColor: MAP_COLORS.primarySoft, fillOpacity: 0.2 }).addTo(this.map)
          this.animatePoint(locationCircle)
          this.$emit('location-found', event.latlng)
        })
        .once('locationerror', (error) => {
          this.$emit('location-error', error)
        })
    },
  },
}
</script>

<style>
.jalan-aing-leaflet .leaflet-control-attribution {
  background: rgba(255, 255, 255, 0.8);
  font-family: Lato, sans-serif;
  font-size: 12px;
}

.jalan-aing-leaflet .leaflet-tooltip {
  border: 0;
  border-radius: 8px;
  color: #1e293b;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 8px;
}

.jalan-aing-leaflet .jalan-aing-point-enter {
  animation: jalan-aing-point-enter 280ms ease-out both;
  transform-box: fill-box;
  transform-origin: center;
}

@keyframes jalan-aing-point-enter {
  from {
    opacity: 0;
    transform: scale(0.35);
  }
  70% {
    opacity: 1;
    transform: scale(1.08);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
