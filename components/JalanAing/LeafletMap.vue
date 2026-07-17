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

const LEAFLET_MAP_CONFIG = Object.freeze({
  center: [-6.9175, 107.6191],
  zoom: 10,
  minZoom: 7,
  maxZoom: 19,
  basemaps: {
    osm: {
      label: 'Light',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      previewClass: 'bg-[linear-gradient(135deg,#dbeafe_25%,#f8fafc_25%,#f8fafc_50%,#bfdbfe_50%,#bfdbfe_75%,#f8fafc_75%)] bg-[length:18px_18px]',
    },
    satellite: {
      label: 'Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri',
      previewClass: 'bg-[linear-gradient(135deg,#365314,#65a30d,#14532d,#166534)]',
    },
    dark: {
      label: 'Dark',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      previewClass: 'bg-[linear-gradient(135deg,#020617,#334155,#0f172a,#475569)]',
    },
  },
})

export default {
  name: 'JalanAingLeafletMap',
  props: {
    layerVisibility: {
      type: Object,
      required: true,
    },
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
    }
  },
  watch: {
    layerVisibility: {
      deep: true,
      handler(value) {
        this.syncLayers(value)
      },
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
          const locationCircle = this.leaflet.circle(event.latlng, { radius: event.accuracy, color: '#1565C0', fillColor: '#60A5FA', fillOpacity: 0.2 }).addTo(this.map)
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
