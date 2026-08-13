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

const ENABLE_GEOSERVER_DATA = false
const BUS_REFRESH_INTERVAL = 10000
const BUS_MAX_SMOOTH_DISTANCE = 750
const BUS_QUERY_MOVE_THRESHOLD = 1000
const BUS_STOP_MIN_ZOOM = 12

const GIS_LAYERS = Object.freeze({
  ruasJalan: {
    label: 'Jalan Provinsi',
    type: 'line',
    color: '#008444',
    wmsUrl: 'https://geoserver.jabarprov.go.id/geoserver/basis_data_dbmpr/wms',
    wmsOptions: { layers: 'basis_data_dbmpr:jaringan_jalan_ln' },
    geoJsonUrl: '/api/jalan-aing/geodata?layer=ruasJalan',
    nameFields: ['namaruasjalan', 'namaruas', 'namajalan', 'nama'],
  },
  rumahSakit: {
    label: 'Rumah Sakit',
    type: 'point',
    color: '#DC2626',
    wmsUrl: 'https://geoserver.jabarprov.go.id/geoserver/dinkes/wms',
    wmsOptions: { layers: 'dinkes:RUMAHSAKIT_PT_50K_2023_JAWABARAT' },
    geoJsonUrl: '/api/jalan-aing/geodata?layer=rumahSakit',
    nameFields: ['namarumahsakit', 'namars', 'namafaskes', 'nama'],
  },
  puskesmas: {
    label: 'Puskesmas',
    type: 'point',
    color: '#2563EB',
    wmsUrl: 'https://geoserver.jabarprov.go.id/geoserver/dinkes_arc/wms',
    wmsOptions: { layers: 'dinkes_arc:puskesmas_pt' },
    geoJsonUrl: '/api/jalan-aing/geodata?layer=puskesmas',
    nameFields: ['namapuskesmas', 'namafaskes', 'nama'],
  },
  restArea: {
    label: 'Rest Area',
    type: 'point',
    color: '#D97706',
    wmsUrl: 'https://geoserver.jabarprov.go.id/geoserver/dishub_arc/wms',
    wmsOptions: { layers: 'dishub_arc:rest_area' },
    geoJsonUrl: '/api/jalan-aing/geodata?layer=restArea',
    nameFields: ['namarestarea', 'namalokasi', 'restarea', 'nama'],
  },
})

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
      wmsLayers: {},
      geoJsonLayers: {},
      geoJsonData: {},
      loadingGeoJson: {},
      geoJsonErrorNotified: {},
      currentLocationMarker: null,
      busMarkers: {},
      busHeadings: {},
      busAnimationFrames: {},
      busPollTimer: null,
      busPollInFlight: false,
      busRefreshQueued: false,
      busQueryCenter: null,
      busErrorNotified: false,
      busStopsLoaded: false,
      busStopErrorNotified: false,
      busStops: [],
      busStopMarkers: {},
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
      handler() {
        this.renderGeoJson('ruasJalan')
        this.syncRoadWmsFilter()
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
    window.clearInterval(this.busPollTimer)
    Object.values(this.busAnimationFrames).forEach((frame) => window.cancelAnimationFrame(frame))
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
        zoomAnimation: true,
        zoomAnimationThreshold: 8,
        zoomSnap: 0,
        zoomDelta: 1,
        wheelPxPerZoomLevel: 100,
        wheelDebounceTime: 24,
        fadeAnimation: true,
        markerZoomAnimation: true,
      })
      this.setBasemap(config.basemap)
      this.createDataLayers()
      this.syncLayers(this.layerVisibility)
      this.startBusPolling()
      this.loadBusStops()
      this.map.on('moveend zoomend', () => {
        this.renderBusStops()
        this.updateBusQueryCenter()
      })
      if (this.pendingLocate) {
        this.pendingLocate = false
        this.locateMe()
      }
      window.setTimeout(() => this.map?.invalidateSize(), 100)
    },
    startBusPolling() {
      this.busQueryCenter = this.map.getCenter()
      this.loadBuses()
      this.busPollTimer = window.setInterval(() => this.loadBuses(), BUS_REFRESH_INTERVAL)
    },
    updateBusQueryCenter() {
      const center = this.map.getCenter()
      if (this.busQueryCenter?.distanceTo(center) < BUS_QUERY_MOVE_THRESHOLD) return
      this.busQueryCenter = center
      if (this.busPollInFlight) {
        this.busRefreshQueued = true
        return
      }
      this.loadBuses()
    },
    async loadBuses() {
      if (this.busPollInFlight) return
      this.busPollInFlight = true
      try {
        const center = this.busQueryCenter || this.map.getCenter()
        const queryCenter = this.leaflet.latLng(center.lat, center.lng)
        const query = new URLSearchParams({ lat: queryCenter.lat.toFixed(6), lng: queryCenter.lng.toFixed(6) })
        const response = await fetch(`/api/jalan-aing/buses?${query}`)
        const payload = await response.json()
        if (!response.ok || !Array.isArray(payload.data)) throw new Error('Data bus tidak tersedia')
        if (queryCenter.distanceTo(this.busQueryCenter) < BUS_QUERY_MOVE_THRESHOLD) {
          this.syncBusMarkers(payload.data, Math.max(1000, (Number(payload.reloadTime) || BUS_REFRESH_INTERVAL) - 500))
          this.$emit('data-status', { bus: true })
        }
        this.busErrorNotified = false
      } catch (error) {
        this.$emit('data-status', { bus: false })
        if (!this.busErrorNotified) {
          this.busErrorNotified = true
          this.$emit('notify', 'Data bus belum dapat dimuat')
        }
      } finally {
        this.busPollInFlight = false
        if (this.busRefreshQueued) {
          this.busRefreshQueued = false
          this.loadBuses()
        }
      }
    },
    async loadBusStops() {
      if (this.busStopsLoaded) return
      try {
        const response = await fetch('/api/jalan-aing/bus-stops')
        const payload = await response.json()
        if (!response.ok || !Array.isArray(payload.data)) throw new Error('Data halte bus tidak tersedia')

        this.busStops = payload.data.map((stop) => {
          const lat = Number(stop.sh_lat)
          const lng = Number(stop.sh_lng)
          return { ...stop, id: String(stop.sh_id), lat, lng }
        }).filter((stop) => stop.id && Number.isFinite(stop.lat) && Number.isFinite(stop.lng))
        this.busStopsLoaded = true
        this.renderBusStops()
        this.$emit('data-status', { busStops: true })
      } catch (error) {
        this.$emit('data-status', { busStops: false })
        if (!this.busStopErrorNotified) {
          this.busStopErrorNotified = true
          this.$emit('notify', 'Data halte bus belum dapat dimuat')
        }
      }
    },
    renderBusStops() {
      const layer = this.layerGroups.busStops
      if (!this.map || !layer || !this.map.hasLayer(layer)) return

      if (this.map.getZoom() < BUS_STOP_MIN_ZOOM) {
        Object.entries(this.busStopMarkers).forEach(([id, marker]) => {
          layer.removeLayer(marker)
          this.$delete(this.busStopMarkers, id)
        })
        return
      }

      const visibleStopIds = new Set()
      const bounds = this.map.getBounds().pad(0.15)
      this.busStops.forEach((stop) => {
        if (!bounds.contains([stop.lat, stop.lng])) return
        visibleStopIds.add(stop.id)
        if (this.busStopMarkers[stop.id]) return

        this.busStopMarkers[stop.id] = this.leaflet.marker([stop.lat, stop.lng], {
          icon: this.busStopIcon(stop),
          alt: stop.sh_name || 'Halte Bus',
          title: stop.sh_name || 'Halte Bus',
        }).on('click', () => this.$emit('select-marker', {
          type: 'Halte Bus',
          label: stop.sh_name || 'Halte Bus',
          shelterId: stop.id,
          properties: { Koridor: stop.in_koridor || stop.kor, Dari: stop.origin, Tujuan: stop.toward },
        })).addTo(layer)
      })
      Object.entries(this.busStopMarkers).forEach(([id, marker]) => {
        if (!visibleStopIds.has(id)) {
          layer.removeLayer(marker)
          this.$delete(this.busStopMarkers, id)
        }
      })
    },
    syncBusMarkers(buses, moveDuration) {
      const activeBusIds = new Set()
      buses.forEach((bus) => {
        const id = String(bus.id || bus.imei || '')
        const lat = Number(bus.bs_lat)
        const lng = Number(bus.bs_lng)
        if (!id || !Number.isFinite(lat) || !Number.isFinite(lng)) return

        activeBusIds.add(id)
        const latLng = [lat, lng]
        const marker = this.busMarkers[id]
        if (marker) {
          this.updateBusHeading(id, marker, bus)
          this.moveBusMarker(id, marker, latLng, moveDuration)
          return
        }

        this.$set(this.busHeadings, id, this.busAngle(bus))
        this.busMarkers[id] = this.leaflet.marker(latLng, {
          icon: this.busIcon(bus),
          alt: bus.name || 'Bus',
          title: bus.name || 'Bus',
          zIndexOffset: 900,
        }).on('click', () => this.$emit('select-marker', {
          type: 'Bus',
          label: bus.name || 'Bus',
          properties: {
            Koridor: bus.kor,
            Tujuan: bus.toward,
            'Plat Nomor': bus.plate_number,
            Kecepatan: `${bus.speed || 0} km/jam`,
            'Update Terakhir': bus.dt_server,
          },
        })).addTo(this.layerGroups.bus)
      })
      Object.entries(this.busMarkers).forEach(([id, marker]) => {
        if (!activeBusIds.has(id)) {
          window.cancelAnimationFrame(this.busAnimationFrames[id])
          this.$delete(this.busAnimationFrames, id)
          this.$delete(this.busHeadings, id)
          this.layerGroups.bus.removeLayer(marker)
          this.$delete(this.busMarkers, id)
        }
      })
    },
    moveBusMarker(id, marker, latLng, duration) {
      const start = marker.getLatLng()
      const target = this.leaflet.latLng(latLng)
      window.cancelAnimationFrame(this.busAnimationFrames[id])
      if (start.distanceTo(target) > BUS_MAX_SMOOTH_DISTANCE) {
        marker.setLatLng(target)
        return
      }

      const startedAt = window.performance.now()
      const move = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1)
        marker.setLatLng([
          start.lat + ((target.lat - start.lat) * progress),
          start.lng + ((target.lng - start.lng) * progress),
        ])
        if (progress < 1) {
          this.busAnimationFrames[id] = window.requestAnimationFrame(move)
        } else {
          this.$delete(this.busAnimationFrames, id)
        }
      }
      this.busAnimationFrames[id] = window.requestAnimationFrame(move)
    },
    updateBusHeading(id, marker, bus) {
      const image = marker.getElement()?.querySelector('img')
      const target = this.busAngle(bus)
      const previous = this.busHeadings[id] ?? target
      const next = previous + ((((target - previous) % 360) + 540) % 360) - 180
      this.$set(this.busHeadings, id, next)
      if (image) {
        image.style.transform = `rotate(${next}deg)`
        return
      }
      marker.setIcon(this.busIcon(bus))
    },
    busAngle(bus) {
      return (Number.isFinite(Number(bus.angle)) ? Number(bus.angle) : 0) + 90
    },
    busIcon(bus) {
      return this.leaflet.divIcon({
        className: 'jalan-aing-bus-icon',
        html: `<img src="/icon/bus-metro-jabartrans.svg" alt="" style="transform:rotate(${this.busAngle(bus)}deg)">`,
        iconSize: [24, 14],
        iconAnchor: [12, 7],
      })
    },
    busStopIcon(stop) {
      const color = /^#[0-9a-f]{6}$/i.test(stop.color) ? stop.color : '#2563EB'
      return this.leaflet.divIcon({
        className: 'jalan-aing-bus-stop-icon',
        html: `<span style="background:${color}"><svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none" aria-hidden="true"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-1.5-6H9V6h6v5z"/></svg></span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      })
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
      this.wmsLayers = {}
      if (!ENABLE_GEOSERVER_DATA) {
        this.$emit('data-status', Object.fromEntries(Object.keys(GIS_LAYERS).map((id) => [id, false])))
        return
      }
      Object.entries(GIS_LAYERS).forEach(([id, config]) => {
        if (!this.layerGroups[id]) return
        const wms = L.tileLayer.wms(config.wmsUrl, {
          ...config.wmsOptions,
          format: 'image/png',
          transparent: true,
          version: '1.1.0',
          opacity: 0.9,
        })
        this.wmsLayers[id] = wms
        this.layerGroups[id].addLayer(wms)
      })
      this.$emit('data-status', Object.fromEntries(Object.keys(GIS_LAYERS).map((id) => [id, true])))
      this.syncRoadWmsFilter()
    },
    async loadGeoJson(id) {
      const config = GIS_LAYERS[id]
      if (!config || this.geoJsonData[id] || this.loadingGeoJson[id]) return

      this.$set(this.loadingGeoJson, id, true)
      try {
        const response = await fetch(config.geoJsonUrl)
        if (!response.ok) throw new Error('GeoJSON tidak tersedia')
        const data = await response.json()
        if (data?.type !== 'FeatureCollection') throw new Error('Format GeoJSON tidak valid')
        this.$set(this.geoJsonData, id, data)
        if (id === 'ruasJalan') this.buildRoadIndex(data)
        this.renderGeoJson(id)
      } catch (error) {
        if (!this.geoJsonErrorNotified[id]) {
          this.$set(this.geoJsonErrorNotified, id, true)
          this.$emit('notify', `Detail ${config.label} belum dapat dimuat`)
        }
      } finally {
        this.$set(this.loadingGeoJson, id, false)
      }
    },
    buildRoadIndex(data) {
      this.roads = (data.features || []).map((feature, index) => {
        const properties = feature.properties || {}
        return {
          id: feature.id || `ruas-jalan-${index}`,
          name: this.featureLabel(feature, GIS_LAYERS.ruasJalan),
          number: this.propertyValue(properties, ['nomorruasjalan', 'nomorruas', 'kodejalan', 'kode']),
          city: this.propertyValue(properties, ['namakabupatenkota', 'kabupatenkota', 'kabupaten', 'kota']),
          condition: this.propertyValue(properties, ['kondisijalan', 'kondisi']),
          surface: this.propertyValue(properties, ['jenispermukaan', 'permukaan']),
          length: this.propertyValue(properties, ['panjangruasjalan', 'panjangruas', 'panjang']),
          feature,
        }
      }).filter((road) => road.name)
    },
    renderGeoJson(id) {
      const data = this.geoJsonData[id]
      const config = GIS_LAYERS[id]
      const group = this.layerGroups[id]
      if (!data || !config || !group || !this.leaflet) return
      if (this.geoJsonLayers[id]) group.removeLayer(this.geoJsonLayers[id])

      const layer = this.leaflet.geoJSON(data, {
        filter: (feature) => id !== 'ruasJalan' || this.roadMatchesClass(feature),
        style: { color: config.color, weight: 10, opacity: 0.01, fillOpacity: 0.01 },
        pointToLayer: (feature, latlng) => this.leaflet.circleMarker(latlng, {
          radius: 9, color: config.color, weight: 10, opacity: 0.01, fillColor: config.color, fillOpacity: 0.01,
        }),
        onEachFeature: (feature, featureLayer) => {
          const label = this.featureLabel(feature, config)
          featureLayer.on('click', () => this.$emit('select-marker', {
            type: config.label,
            label,
            properties: feature.properties || {},
          }))
        },
      })
      this.geoJsonLayers[id] = layer
      group.addLayer(layer)
      this.syncLayers(this.layerVisibility)
    },
    roadMatchesClass(feature) {
      const wanted = this.filterStatus.roadClass
      if (!wanted || wanted === 'semua') return true
      const roadClass = String(this.propertyValue(feature.properties || {}, ['fgsrjl']) || '').toLowerCase()
      return roadClass === wanted.replace(/_/g, ' ')
    },
    syncRoadWmsFilter() {
      const layer = this.wmsLayers.ruasJalan
      if (!layer) return
      const filters = {
        arteri_primer: "fgsrjl='Jalan Arteri Primer'",
        kolektor_primer: "fgsrjl='Jalan Kolektor Primer'",
        jalan_tol: "fgsrjl='Jalan Tol'",
      }
      layer.setParams({ cql_filter: filters[this.filterStatus.roadClass] || '' })
    },
    normalisePropertyKey(key) {
      return String(key).toLowerCase().replace(/[^a-z0-9]/g, '')
    },
    propertyValue(properties, aliases) {
      const wanted = aliases.map((alias) => this.normalisePropertyKey(alias))
      const entry = Object.entries(properties).find(([key, value]) => wanted.includes(this.normalisePropertyKey(key)) && value !== null && value !== '')
      return entry?.[1]
    },
    featureLabel(feature, config) {
      const properties = feature.properties || {}
      const value = this.propertyValue(properties, config.nameFields)
      if (value) return String(value)
      const fallback = Object.entries(properties).find(([key, value]) => value && !/(^|_)(id|gid|objectid|shape|geom)(_|$)/i.test(key))
      return fallback ? String(fallback[1]) : config.label
    },
    search(query) {
      const term = query.trim().toLowerCase()
      const results = term ? this.roads.filter((road) => `${road.name} ${road.city}`.toLowerCase().includes(term)).slice(0, 6) : []
      this.$emit('search-results', results)
    },
    focusRoad(id) {
      const road = this.roads.find((item) => item.id === id)
      if (!road || !this.map) return
      const bounds = this.leaflet.geoJSON(road.feature).getBounds()
      if (bounds.isValid()) this.map.fitBounds(bounds, { padding: [32, 32], maxZoom: 15 })
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
        if (visibility[id] && GIS_LAYERS[id]) this.loadGeoJson(id)
      })
      if (visibility.busStops) this.renderBusStops()
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
          if (this.currentLocationMarker) {
            this.currentLocationMarker.setLatLng(event.latlng)
          } else {
            this.currentLocationMarker = this.leaflet.marker(event.latlng, {
              icon: this.leaflet.icon({ iconUrl: '/icon/pin-map.svg', iconSize: [24, 28], iconAnchor: [12, 28] }),
              alt: 'Lokasi saya',
              title: 'Lokasi saya',
              zIndexOffset: 1000,
            }).addTo(this.map)
          }
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

.jalan-aing-leaflet .leaflet-zoom-animated {
  transition-duration: 320ms;
  transition-timing-function: cubic-bezier(0.22, 0.75, 0.3, 1);
}

.jalan-aing-bus-icon {
  background: transparent;
  border: 0;
  animation: jalan-aing-bus-enter 220ms ease-out both;
}

.jalan-aing-bus-stop-icon {
  background: transparent;
  border: 0;
}

.jalan-aing-bus-stop-icon span {
  display: grid;
  height: 22px;
  width: 22px;
  place-items: center;
  border: 2px solid white;
  border-radius: 7px;
  box-shadow: 0 1px 5px rgb(15 23 42 / 0.3);
}

.jalan-aing-bus-icon img {
  height: 14px;
  width: 24px;
  filter: drop-shadow(0 2px 3px rgb(15 23 42 / 0.32));
  transform-origin: center;
  transition: transform 420ms ease-out;
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

@keyframes jalan-aing-bus-enter {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .jalan-aing-leaflet .leaflet-zoom-animated { transition-duration: 0ms; }
  .jalan-aing-bus-icon { animation: none; }
}
</style>
