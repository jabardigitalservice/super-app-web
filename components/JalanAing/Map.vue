<template>
  <div>
    <div ref="map" class="w-full h-[400px]" />
    <p class="mt-1 text-right text-[10px] text-gray-400">
      &copy;
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        class="underline"
        >OpenStreetMap</a
      >
      contributors
    </p>
    <slot />
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'

const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse'

export default {
  props: {
    coords: {
      type: Object,
      default: () => ({
        lat: 0,
        lng: 0,
      }),
    },
    zoom: {
      type: Number,
      default: 15,
    },
  },
  data() {
    return {
      leaflet: null,
      map: null,
      marker: null,
    }
  },
  mounted() {
    this.initMap()
  },
  beforeDestroy() {
    if (this.map) {
      this.map.remove()
    }
  },
  methods: {
    async initMap() {
      const module = await import('leaflet')
      this.leaflet = module.default || module

      const L = this.leaflet
      const map = L.map(this.$refs.map).setView(
        [this.coords.lat, this.coords.lng],
        this.zoom
      )
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map)

      const marker = L.marker([this.coords.lat, this.coords.lng], {
        icon: L.icon({
          iconUrl: '/icon/pin-map.svg',
          iconSize: [32, 40],
          iconAnchor: [16, 40],
        }),
        draggable: true,
      }).addTo(map)

      this.map = map
      this.marker = marker
      this.setMapEvent()
      this.setMarkerEvent()
      this.lookupAddress(this.coords)
    },
    setMapEvent() {
      this.map.on('click', (e) => {
        const position = { lat: e.latlng.lat, lng: e.latlng.lng }
        this.marker.setLatLng(e.latlng)
        this.$emit('click:map', { position, map: this.map, event: e })
        this.lookupAddress(position)
      })
    },
    setMarkerEvent() {
      this.marker.on('dragend', () => {
        const latLng = this.marker.getLatLng()
        const position = { lat: latLng.lat, lng: latLng.lng }
        this.$emit('dragend:marker', { position, map: this.map, event: { latlng: latLng } })
        this.lookupAddress(position)
      })
    },
    async lookupAddress(coords) {
      try {
        const response = await fetch(
          `${NOMINATIM_REVERSE_URL}?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1&accept-language=id`
        )
        if (!response.ok) throw new Error('Reverse geocoding gagal')
        const data = await response.json()
        this.$emit('set:place', this.toPlace(data))
      } catch (e) {
        console.error(e)
      }
    },
    toPlace(nominatimResult) {
      const address = nominatimResult.address || {}
      const component = (longName, type) =>
        longName ? { long_name: longName, short_name: longName, types: [type] } : null

      const kota = address.city || address.county || address.state_district
      const kecamatan = address.city_district || address.suburb || address.municipality
      const kelurahan = address.village || address.neighbourhood || address.hamlet

      return {
        name: address.road || nominatimResult.display_name?.split(',')[0] || '',
        formatted_address: nominatimResult.display_name || '',
        address_components: [
          component(kota, 'administrative_area_level_2'),
          component(kecamatan, 'administrative_area_level_3'),
          component(kelurahan, 'administrative_area_level_4'),
        ].filter(Boolean),
      }
    },
  },
}
</script>
